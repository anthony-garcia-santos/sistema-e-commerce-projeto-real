//src/models/UserModel.js

const mongoose = require('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

const Usuarios = mongoose.model('Usuarios', userSchema,);

module.exports = Usuarios;
