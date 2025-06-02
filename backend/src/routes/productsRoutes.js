const express = require('express');
const router = express.Router();



const { criarProduto, listarProdutos, produtoId} = require('../controllers/productController');

const { buscarProduto } = require('../controllers/SearchController'); // require no lugar do import

const { verificarAdmin } = require('../validator/verifyAdmin');
// const { verificarUsuario } = require('../validator/verifyUsers');


router.get('/produtos', listarProdutos ); // protegida
router.get('/produtos/:id', produtoId);  // protegida

router.post('/produtos', verificarAdmin, criarProduto); // protegida + admin

router.get('/buscar-produto', (req, res, next) => {
  console.log('Query params:', req.query);
  next();
}, buscarProduto);


module.exports = router;