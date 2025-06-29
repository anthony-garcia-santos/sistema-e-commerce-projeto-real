const express = require('express');
const router = express.Router();



const { criarProduto, listarProdutos, produtoId } = require('../controllers/productController');
const { buscarProduto } = require('../controllers/SearchController'); 

const { verificarAdmin } = require('../validator/verifyAdmin');

console.log({ criarProduto, listarProdutos, produtoId });

router.post('/produtos', verificarAdmin, criarProduto); 
router.get('/produtos/lista', listarProdutos ); 
router.get('/produtos/:id', produtoId);  

router.get('/buscar-produto', (req, res, next) => {
  console.log('Query params:', req.query);
  next();
}, buscarProduto);


module.exports = router;