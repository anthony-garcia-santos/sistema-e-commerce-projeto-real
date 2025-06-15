const express = require('express');
const router = express.Router();
const cartController = require('../controllers/ControllerCart');
const { verificarUsuario } = require('../validator/verifyUsers')

router.post('/create', cartController.createCart);
router.post('/add-item', cartController.AddCart);
router.get('/cart/', verificarUsuario, cartController.buscarCarrinho);

module.exports = router;
