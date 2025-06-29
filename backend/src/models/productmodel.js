

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
    imagem: String,
    descricao: String,
    descricaoDetalhada: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = mongoose.model('produto', productSchema);

