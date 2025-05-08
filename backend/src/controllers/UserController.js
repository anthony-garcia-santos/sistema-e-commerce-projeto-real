//src/controller/UserController.js

const Usuarios = require('../models/UserModel');

// Função para registrar um novo usuário

const helloword = async (req, res) => {

    res.send("API no ar");

}




const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const novoUsuario = new Usuarios({ nome, email, senha });
        await novoUsuario.save();
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao salvar no MongoDB:", erro);
        res.status(500).json({ message: "Erro interno ao salvar no banco de dados" });
    }
};

// Função para listar todos os usuários
const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuarios.find({}, "-senha");
        console.log(usuarios);  // Verifique o que está sendo retornado
        res.json(usuarios);
    } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);
        res.status(401).json({ message: "Erro ao buscar usuários no banco de dados" });
    }
};

// Função para buscar um usuário pelo ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuarios.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        res.json(usuario);
    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
        res.status(401).json({ mensagem: "Usuário não encontrado" });
    }
};

module.exports = { registerUser, getUsers, getUserById, helloword};
