const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const Usuario = require('../models/UserModel');
const Produto = require('../models/productmodel');

exports.adicionarAoCarrinho = async (req, res) => {
  console.log('\n===== INÍCIO DA REQUISIÇÃO =====');
  console.log('Body recebido:', req.body);
  
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // Verificação básica de dados
    if (!userId || !productId) {
      console.error('Dados incompletos');
      return res.status(400).json({ 
        success: false,
        message: 'Dados incompletos: userId e productId são obrigatórios'
      });
    }

    console.log('Verificando IDs...');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('ID de usuário inválido:', userId);
      return res.status(400).json({ 
        success: false,
        message: 'ID de usuário inválido'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error('ID de produto inválido:', productId);
      return res.status(400).json({ 
        success: false,
        message: 'ID de produto inválido'
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    console.log('Verificando existência de usuário e produto...');
    const [usuario, produto] = await Promise.all([
      Usuario.findById(userObjectId).lean(),
      Produto.findById(productObjectId).lean()
    ]);

    if (!usuario) {
      console.error('Usuário não encontrado');
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    if (!produto) {
      console.error('Produto não encontrado');
      return res.status(404).json({ 
        success: false,
        message: 'Produto não encontrado'
      });
    }

    console.log('Buscando carrinho existente...');
    let cart = await Cart.findOne({ userId: userObjectId });
    
    if (!cart) {
      console.log('Criando novo carrinho');
      cart = new Cart({ 
        userId: userObjectId, 
        items: [] 
      });
    }

    console.log('Verificando item no carrinho...');
    const itemIndex = cart.items.findIndex(item => 
      item.productId.equals(productObjectId)
    );

    if (itemIndex > -1) {
      console.log('Atualizando quantidade do item existente');
      cart.items[itemIndex].quantity += quantity;
    } else {
      console.log('Adicionando novo item ao carrinho');
      cart.items.push({ 
        productId: productObjectId, 
        quantity 
      });
    }

    console.log('Tentando salvar carrinho...');
    const savedCart = await cart.save();
    
    console.log('Carrinho salvo com sucesso! ID:', savedCart._id);
    console.log('===== FIM DA REQUISIÇÃO (SUCESSO) =====\n');
    
    res.status(200).json({
      success: true,
      message: 'Item adicionado ao carrinho',
      cartId: savedCart._id
    });
    
  } catch (error) {
    console.error('ERRO CRÍTICO:', error);
    console.error('Stack trace:', error.stack);
    console.log('===== FIM DA REQUISIÇÃO (ERRO) =====\n');
    
    res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor',
      error: error.message
    });
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
