const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { verificarUsuario } = require('../validator/verifyUsers');
const { verificarAdmin } = require('../validator/verifyAdmin');
const Pedido = require('../models/Pedidos');

router.post('/create-payment-intent', verificarUsuario, pagamentoController.criarPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), pagamentoController.handleWebhook);
router.get('/payment-status/:id', verificarUsuario, pagamentoController.verificarStatusPagamento);

router.get('/pedidos', verificarAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ criadoEm: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;
