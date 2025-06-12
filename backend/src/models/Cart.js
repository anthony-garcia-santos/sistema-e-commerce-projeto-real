const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'produto', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
