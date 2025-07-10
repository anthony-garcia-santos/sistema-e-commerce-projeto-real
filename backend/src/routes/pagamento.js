const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { verificarUsuario } = require('../validator/verifyUsers');
const { verificarAdmin } = require('../validator/verifyAdmin');
const Pedido = require('../models/Pedidos');

router.post('/create-payment-intent', verificarUsuario, pagamentoController.criarPaymentIntent);
router.get('/payment-status/:id', verificarUsuario, pagamentoController.verificarStatusPagamento);

router.get('/pedidos', verificarAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ criadoEm: -1 }).populate('userId', 'nome email');
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

router.get('/listarPagamento', verificarAdmin, pagamentoController.listarPagamentos);

module.exports = router;
