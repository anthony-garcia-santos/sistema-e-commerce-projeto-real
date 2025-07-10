const Stripe = require('stripe');
const Pedido = require('../models/Pedidos');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});














const criarPaymentIntent = async (req, res) => {
  try {
    const { total, metodo, itens, endereco } = req.body;

    // Validações mais completas
    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total inválido',
        details: 'O valor total deve ser um número positivo'
      });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Carrinho vazio',
        details: 'Adicione itens ao carrinho antes de finalizar'
      });
    }

    // Validação básica de endereço
    if (!endereco || !endereco.rua || !endereco.cidade) {
      return res.status(400).json({
        success: false,
        error: 'Endereço incompleto',
        details: 'Informe pelo menos rua e cidade para entrega'
      });
    }

    const amount = Math.round(parseFloat(total) * 100);

    // Preparar metadados dos itens
    const itensMetadata = itens.map(item => ({
      id: item.productId?._id || 'undefined',
      nome: item.productId?.nome || 'undefined',
      quantidade: item.quantity,
      preco: item.productId?.preco || 0,
      imagem: item.productId?.imagem || null
    }));

    // Parâmetros do pagamento
    const params = {
      amount,
      currency: 'brl',
      metadata: {
        userId: req.user?.id || 'guest',
        userName: req.user?.nome || 'Visitante',
        userEmail: req.user?.email || null,
        itens: JSON.stringify(itensMetadata),
        endereco: JSON.stringify(endereco),
        app_version: '1.0.0' // Adicione metadados úteis para rastreamento
      },
      payment_method_types: [],
      description: `Pedido de ${req.user?.nome || 'Visitante'} (${itens.length} itens)`
    };

    // Configurar método de pagamento específico
    switch (metodo) {
      case 'creditCard':
        params.payment_method_types = ['card'];
        break;
      case 'pix':
        params.payment_method_types = ['pix'];
        params.payment_method_options = {
          pix: {
            expires_after_seconds: 60 * 30, // 30 minutos
          }
        };
        break;
      case 'paypal':
        params.payment_method_types = ['paypal'];
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Método de pagamento inválido',
          details: 'Escolha entre creditCard, pix ou paypal'
        });
    }

    // Criar intenção de pagamento
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Caso especial para Pix (gera QR code)
    if (metodo === 'pix') {
      const confirmedIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        { payment_method: 'pix' }
      );

      return res.json({
        success: true,
        paymentIntentId: confirmedIntent.id,
        payment_method: 'pix',
        pix_qr_code: confirmedIntent.next_action?.pix_display_qr_code?.qr_code,
        pix_code: confirmedIntent.next_action?.pix_display_qr_code?.code,
        expires_at: confirmedIntent.next_action?.pix_display_qr_code?.expires_at
      });
    }

    // Retorno padrão para outros métodos
    return res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      payment_method: params.payment_method_types[0]
    });

  } catch (error) {
    console.error('Erro no pagamento:', error);

    // Tratamento de erros específicos do Stripe
    let userMessage = 'Erro ao processar pagamento';
    let details = null;

    if (error.code === 'amount_too_small') {
      userMessage = 'Valor mínimo para pagamento é R$ 0,50';
    } else if (error.type === 'StripeCardError') {
      userMessage = 'Erro no cartão: ' + error.message;
    } else if (error.code === 'parameter_invalid_empty') {
      userMessage = 'Dados de pagamento inválidos';
      details = error.message;
    }

    return res.status(500).json({
      success: false,
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? (details || error.message) : undefined
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












const listarPagamentos = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.charges.data.balance_transaction']
    });

    const pedidos = await Pedido.find().sort({ criadoEm: -1 }).populate('userId', 'nome email');

    const combinedData = payments.data.map(payment => {
      const matchingOrder = pedidos.find(order =>
        order.stripePaymentId === payment.id
      );

      // Processar endereço com tratamento de erro
      let enderecoEntrega = {};
      try {
        enderecoEntrega = matchingOrder?.enderecoEntrega || 
          (payment.metadata?.endereco ? JSON.parse(payment.metadata.endereco) : {});
      } catch (e) {
        console.error('Erro ao processar endereço:', e);
        enderecoEntrega = {
          rua: 'Erro ao carregar endereço',
          cidade: ''
        };
      }

      // Processar itens com tratamento de erro
      let itens = [];
      try {
        itens = matchingOrder?.itens ||
          (payment.metadata?.itens ? JSON.parse(payment.metadata.itens) : []);
      } catch (e) {
        console.error('Erro ao processar itens:', e);
        itens = [{ nome: 'Erro ao carregar itens', quantidade: 0 }];
      }

      return {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        created: new Date(payment.created * 1000),
        payment_method: payment.payment_method_types[0],
        cliente: {
          id: payment.metadata?.userId || 'guest',
          nome: matchingOrder?.userName || payment.metadata?.userName || 'Visitante',
          email: matchingOrder?.userEmail || payment.metadata?.userEmail || null
        },
        itens: itens,
        enderecoEntrega: enderecoEntrega, // Removida a duplicação
        orderId: matchingOrder?._id,
        orderStatus: matchingOrder?.status,
        payment_details: {
          last4: payment.charges?.data[0]?.payment_method_details?.card?.last4 || null,
          network: payment.charges?.data[0]?.payment_method_details?.card?.network || null
        }
      };
    });

    res.json({
      success: true,
      data: combinedData,
      count: combinedData.length
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pagamentos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};












const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    try {
      const metadata = paymentIntent.metadata;
      const itens = JSON.parse(metadata.itens || '[]');
      const endereco = JSON.parse(metadata.endereco || '{}');

      // Verificar se o pedido já existe para evitar duplicatas
      const pedidoExistente = await Pedido.findOne({ stripePaymentId: paymentIntent.id });
      if (pedidoExistente) {
        console.log(`ℹ️ Pedido ${paymentIntent.id} já existe, ignorando...`);
        return res.sendStatus(200);
      }

      await Pedido.create({
        userId: metadata.userId !== 'guest' ? metadata.userId : null,
        userName: metadata.userName || 'Visitante',
        userEmail: metadata.userEmail || null,
        itens: itens.map(item => ({
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade,
          productId: item.id,
          imagem: item.imagem || null
        })),
        total: paymentIntent.amount / 100,


        enderecoEntrega: {
          rua: endereco.rua || 'Não informado',
          numero: endereco.numero || 'S/N',
          complemento: endereco.complemento || '',
          bairro: endereco.bairro || 'Não informado',
          cidade: endereco.cidade || 'Não informado',
          estado: endereco.estado || 'Não informado',
          cep: endereco.cep || '00000000'
        },


        metodoPagamento: `stripe_${paymentIntent.payment_method_types[0]}`,
        stripePaymentId: paymentIntent.id,
        status: 'pago'
      });

      console.log(`✅ Pedido ${paymentIntent.id} registrado com sucesso`);
    } catch (err) {
      console.error(`❌ Erro ao salvar pedido:`, err);
    }
  }

  res.status(200).json({ received: true });
};


module.exports = {
  criarPaymentIntent,
  verificarStatusPagamento,
  handleWebhook,
  listarPagamentos
};

