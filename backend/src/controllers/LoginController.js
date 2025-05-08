//src/controller/LoginController.js

const { validationResult } = require('express-validator');
const Usuarios = require('../models/UserModel');

// Função para login
const LogarUsuario = async (req, res) => {

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
        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }

        // Se tudo estiver certo, envia a resposta com uma mensagem de boas-vindas
        res.json({ mensagem: `Bem-vindo, ${usuario.nome}!` });
    } catch (erro) {
        // Se houver um erro ao acessar o banco de dados
        console.error("Erro ao tentar logar:", erro);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};

module.exports = { LogarUsuario };
