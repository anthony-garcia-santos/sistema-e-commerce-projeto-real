const Stripe = require('stripe');
const Pedido = require('../models/Pedidos');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const criarPaymentIntent = async (req, res) => {
  try {
    const { total, metodo, itens, endereco } = req.body;

    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const amount = Math.round(parseFloat(total) * 100);

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
      payment_method_types: []
    };

    if (metodo === 'creditCard') {
      params.payment_method_types = ['card'];
    } else if (metodo === 'pix') {
      params.payment_method_types = ['pix'];
      params.payment_method_options = {
        pix: { expires_after_seconds: 60 * 30 }
      };
    } else if (metodo === 'paypal') {
      params.payment_method_types = ['paypal'];
    } else {
      return res.status(400).json({ error: 'Método de pagamento inválido' });
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    if (metodo === 'pix') {
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
      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }
  } catch (error) {
    console.error('Erro no pagamento:', error);

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

const verificarStatusPagamento = async (req, res) => {
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

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const data = event.data.object;

      try {
        const userId = data.metadata?.userId || null;
        const itens = JSON.parse(data.metadata?.itens || '[]');
        const endereco = JSON.parse(data.metadata?.endereco || '{}');
        const metodo = data.payment_method_types?.[0] || 'desconhecido';

        if (!itens.length) {
          console.warn(`⚠️ Nenhum item no pedido Stripe ID: ${data.id}`);
          break;
        }

        await Pedido.create({
          userId: userId !== 'guest' ? userId : null,
          itens: itens.map(item => ({
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
            productId: item.id
          })),
          total: data.amount / 100,
          endereco,
          metodoPagamento: metodo,
          status: 'pago'
        });

        console.log(`✅ Pedido salvo com sucesso (Stripe ID: ${data.id})`);
      } catch (err) {
        console.error(`❌ Erro ao salvar pedido:`, err);
      }

      break;
    }

    case 'payment_intent.payment_failed':
      console.log(`❌ Pagamento ${event.data.object.id} falhou.`);
      break;

    case 'payment_intent.created':
      console.log(`ℹ️ Novo pagamento criado: ${event.data.object.id}`);
      break;

    default:
      console.log(`📌 Evento Stripe não tratado: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  criarPaymentIntent,
  verificarStatusPagamento,
  handleWebhook
};
