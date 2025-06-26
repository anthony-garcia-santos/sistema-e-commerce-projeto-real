import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Criar payment intent
exports.criarPaymentIntent = async (req, res) => {
  try {
    const { total, metodo, itens, endereco } = req.body;

    // Validações básicas
    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Converter para centavos (valor inteiro)
    const amount = Math.round(parseFloat(total) * 100);

    // Montar metadata, cuidado com campos undefined
    const itensMetadata = itens.map(item => ({
      id: item.productId?._id || 'undefined',
      nome: item.productId?.nome || 'undefined',
      quantidade: item.quantity,
      preco: item.productId?.preco || 0
    }));

    const params = {
      amount,
      currency: 'brl',
      metadata: {
        userId: req.user?.id || 'guest',
        itens: JSON.stringify(itensMetadata),
        endereco: JSON.stringify(endereco)
      },
      payment_method_types: [] // será definido abaixo
    };

    // Definir payment_method_types conforme método
    if (metodo === 'creditCard') {
      params.payment_method_types = ['card'];
      // REMOVIDO: params.confirm = true;  // Confirmar separadamente no front
    }
    else if (metodo === 'pix') {
      // ATENÇÃO: PIX pode não estar disponível em todas contas
      params.payment_method_types = ['pix'];
      params.payment_method_options = {
        pix: { expires_after_seconds: 60 * 30 } // 30 minutos
      };
    }
    else if (metodo === 'paypal') {
      // PAYPAL não é nativo do Stripe, normalmente usa outro fluxo
      // Aqui só como placeholder (provavelmente vai falhar)
      params.payment_method_types = ['paypal'];
    }
    else {
      return res.status(400).json({ error: 'Método de pagamento inválido' });
    }

    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Resposta específica por método
    if (metodo === 'pix') {
      // Confirmar para gerar QR code
      const confirmedIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        { payment_method: 'pix' }
      );

      return res.json({
        paymentIntentId: confirmedIntent.id,
        pix_qr_code: confirmedIntent.next_action?.pix_display_qr_code?.qr_code,
        pix_code: confirmedIntent.next_action?.pix_display_qr_code?.code,
        expires_at: confirmedIntent.next_action?.pix_display_qr_code?.expires_at
      });
    } else {
      // Para cartão, devolve clientSecret para front confirmar
      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }
  } catch (error) {
    console.error('Erro no pagamento:', error);
    console.error(error.stack);


    let userMessage = 'Erro ao processar pagamento';
    if (error.code === 'amount_too_small') {
      userMessage = 'Valor mínimo para pagamento é R$ 0,50';
    } else if (error.type === 'StripeCardError') {
      userMessage = 'Erro no cartão: ' + error.message;
    }

    return res.status(500).json({
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Verificar status do pagamento
exports.verificarStatusPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    const response = {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      created: new Date(paymentIntent.created * 1000).toISOString(),
      payment_method: paymentIntent.payment_method_types[0],
      last_payment_error: paymentIntent.last_payment_error
    };

    if (paymentIntent.payment_method_types[0] === 'pix' &&
      paymentIntent.next_action?.pix_display_qr_code) {
      response.pix_qr_code = paymentIntent.next_action.pix_display_qr_code.qr_code;
      response.pix_expires_at = paymentIntent.next_action.pix_display_qr_code.expires_at;
    }

    res.json(response);
  } catch (error) {
    console.error('Erro ao verificar status:', error.stack);
    res.status(500).json({
      error: 'Erro ao verificar status do pagamento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Webhook handler
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use req.rawBody (express.raw middleware obrigatório!)
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processa eventos
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(`Pagamento ${event.data.object.id} bem-sucedido!`);
      break;
    case 'payment_intent.payment_failed':
      console.log(`Pagamento ${event.data.object.id} falhou. Razão: ${event.data.object.last_payment_error?.message}`);
      break;
    case 'payment_intent.created':
      console.log(`Novo pagamento criado: ${event.data.object.id}`);
      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.json({ received: true });
};
