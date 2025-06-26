const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { verificarUsuario } = require('../validator/verifyUsers');

// Configuração do Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', verificarUsuario, pagamentoController.criarPaymentIntent);
router.post('/webhook', express.raw({type: 'application/json'}), pagamentoController.handleWebhook);

router.get('/payment-status/:id', verificarUsuario, pagamentoController.verificarStatusPagamento);

module.exports = router;