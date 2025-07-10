const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  userName: { type: String, required: true },
  userEmail: { type: String, required: false },
  itens: [{
    nome: String,
    preco: Number,
    quantidade: Number,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'produto' },
    imagem: String
  }],
  total: Number,
  enderecoEntrega: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, required: false },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true }
  },
  metodoPagamento: String,
  stripePaymentId: String,
  status: { type: String, default: 'pago', enum: ['pago', 'processando', 'enviado', 'entregue', 'cancelado'] },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date, default: Date.now }
});

// Index para melhorar consultas
pedidoSchema.index({ userId: 1, criadoEm: -1 });
pedidoSchema.index({ stripePaymentId: 1 }, { unique: true });

module.exports = mongoose.model('Pedido', pedidoSchema);