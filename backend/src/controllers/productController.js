const ProdutoModel = require('../models/productmodel');
const mongoose = require('mongoose');

exports.criarProduto = async (req, res) => {
  try {

    const { nome, preco, imagem, descricao } = req.body;
    const novoProduto = new ProdutoModel({ nome, preco, imagem, descricao });
    await novoProduto.save();
    res.status(201).json(novoProduto);
    
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};


exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await ProdutoModel.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.produtoId = async (req, res) => {
  try {

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const produtoEncontrado = await ProdutoModel.findById(req.params.id);

    if (!produtoEncontrado) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(produtoEncontrado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};
