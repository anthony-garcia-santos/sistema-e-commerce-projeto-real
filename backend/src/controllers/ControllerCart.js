const cartSchema = require('../models/productmodel');


const Cart = require('../models/Cart');
const mongoose = require('mongoose');

exports.adicionarAoCarrinho = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Verifica se o carrinho já existe para esse usuário
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Se não existe, cria um novo
            cart = new Cart({ userId, items: [] });
        }

        // Procura se o produto já está no carrinho
        const existingItem = cart.items.find(item => item.productId.equals(productId));

        if (existingItem) {
            // Atualiza a quantidade
            existingItem.quantity += quantity;
        } else {
            // Adiciona novo produto
            cart.items.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();

        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho' });
    }
};


exports.buscarCarrinho = async (req, res) => {
    try {
        const { userId } = req.params;

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
