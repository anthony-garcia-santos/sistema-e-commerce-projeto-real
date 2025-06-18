const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const Product = require('../models/productmodel');

exports.createCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      return res.status(400).json({ message: "Carrinho já existe" });
    }

    const cart = new Cart({ userId, items: [] });
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar carrinho' });
  }
};



exports.AddCart = async (req, res) => {
  try {
    const userId = req.usuario._id; // Obtém o ID do usuário do token
    const { produtoId, quantidade } = req.body;

    // Busca ou cria carrinho
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Adiciona item ao carrinho
    const existingItem = cart.items.find(item => 
      item.productId.toString() === produtoId
    );

    if (existingItem) {
      existingItem.quantity += quantidade;
    } else {
      cart.items.push({
        productId: produtoId,
        quantity: quantidade
      });
    }

    await cart.save();
    res.json(cart);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar item no carrinho' });
  }
};



exports.buscarCarrinho = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carrinho' });
  }
};
