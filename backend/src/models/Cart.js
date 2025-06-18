const mongoose = require ('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', // Deve corresponder ao nome do modelo de usuário
    required: true,
    index: true
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'produto', // Deve corresponder ao nome do modelo de produto
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1, 
      min: [1, 'Quantidade não pode ser menor que 1'] 
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// CORREÇÃO: Exporte como 'Cart' para manter consistência
module.exports = mongoose.model('Cart', cartSchema);