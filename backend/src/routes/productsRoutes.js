const express = require('express');
const router = express.Router();



const { criarProduto, listarProdutos, produtoId} = require('../controllers/productController');

const { verificarAdmin } = require('../validator/verifyAdmin');
const { verificarUsuario } = require('../validator/verifyUsers');


router.get('/produtos', listarProdutos ); // protegida
router.get('/produtos/:id', verificarUsuario, produtoId);  // protegida

router.post('/produtos', verificarUsuario, verificarAdmin, criarProduto); // protegida + admin




module.exports = router;