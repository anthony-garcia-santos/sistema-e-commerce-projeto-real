const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false }, 
  itens: [{
    nome: String,
    preco: Number,
    quantidade: Number,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'produto' }
  }],
  total: Number,
  endereco: Object,
  metodoPagamento: String,
  status: { type: String, default: 'pago' },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
