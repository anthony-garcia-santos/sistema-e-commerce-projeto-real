//backend/src/controller/LoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const Usuarios = require('../models/UserModel');

// Função para login
const LogarUsuario = async (req, res) => {

    console.log("Dados recebidos no login:", req.body); // <-- ADICIONE ISSO
    
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        // Se houver erros de validação, retornamos para o cliente
        return res.status(400).json({ erros: erros.array() });
    }

    const { email, senha } = req.body;

    try {
        // Procura o usuário no banco de dados pelo email
        const usuario = await Usuarios.findOne({ email });

        // Verifica se o usuário foi encontrado e se a senha é correta
        if (!usuario) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }

        const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!SenhaCorreta) {

            return res.status(401).json({ mensagem: "Email ou senha invalido" })
        }


        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                role: usuario.role
            },

            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES });

        res.json({ mensagem: `Bem-vindo, ${usuario.nome}!`, token });

    } catch (erro) {
        // Se houver um erro ao acessar o banco de dados
        console.error("Erro ao tentar logar:", erro);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }


};

module.exports = { LogarUsuario };
