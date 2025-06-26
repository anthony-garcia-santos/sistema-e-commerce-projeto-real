const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.criarPaymentIntent = async (req, res) => {
  try {
    const { total, metodo, itens, endereco } = req.body;
    
    // Validações básicas
    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }

    // Configuração base do pagamento
    const params = {
      amount: Math.round(total * 100), // Em centavos
      currency: 'brl',
      metadata: {
        userId: req.user.id,
        itens: JSON.stringify(itens),
        endereco: JSON.stringify(endereco)
      }
    };

    // Configurações específicas por método de pagamento
    if (metodo === 'creditCard') {
      params.payment_method_types = ['card'];
      params.automatic_payment_methods = { enabled: true };
    } 
    else if (metodo === 'pix') {
      params.payment_method_types = ['pix'];
      params.payment_method_options = {
        pix: { 
          expires_after_seconds: 60 * 30 // 30 minutos para pagar
        }
      };
    }
    else if (metodo === 'paypal') {
      // Implementação do PayPal pode requerer lógica adicional
      return res.status(400).json({ error: 'PayPal ainda não implementado' });
    }

    // Criar a intenção de pagamento no Stripe
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Resposta personalizada por método de pagamento
    if (metodo === 'pix') {
      // Para PIX, retornamos o QR code e informações adicionais
      const pixData = paymentIntent.next_action.pix_display_qr_code;
      res.json({
        paymentIntentId: paymentIntent.id,
        pix_qr_code: pixData.qr_code,
        pix_code: pixData.code,
        expires_at: pixData.expires_at
      });
    } else {
      // Para cartão, retornamos o clientSecret
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }

  } catch (error) {
    console.error('Erro no pagamento:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    });
  }
};

exports.verificarStatusPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Converter para reais
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      payment_method: paymentIntent.payment_method_types[0]
    });
    
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
};






// Adicione no seu arquivo de rotas

// E no controlador
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Tratar diferentes tipos de eventos
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`Pagamento ${paymentIntent.id} foi bem-sucedido!`);
      // Aqui você pode atualizar seu banco de dados
      break;
    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      console.log(`Pagamento ${failedIntent.id} falhou.`);
      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.json({ received: true });
};