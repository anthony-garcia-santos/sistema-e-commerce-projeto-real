//backend/src/controller/RegisterController.js

const Usuarios = require('../models/UserModel');
const bcrypt = require('bcryptjs'); // IMPORTANTE

// Função para registrar um novo usuário

const helloword = async (req, res) => {

    res.send("API no ar");

}





const RegistrarUsuario = async (req, res) => {
    
    const { nome, email, senha } = req.body;

    try {

        const senhahash = await bcrypt.hash(senha, 10);

        const novoUsuario = new Usuarios({ nome, email, senha: await bcrypt.hash(senha, 10), role: role || 'user',});

        await novoUsuario.save();

        res.status(201).json({ message: "Usuário registrado com sucesso!" });


    } catch (erro) {
        console.error("Erro ao salvar no MongoDB:", erro);
        res.status(500).json({ message: "Erro interno ao salvar no banco de dados" });
    }
};





// Função para listar todos os usuários
const BuscarUsuario = async (req, res) => {
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
const BuscarUsuarioPorID = async (req, res) => {
    const { id } = req.params;

    if (id === 'favicon.ico') return res.status(204).end();


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

module.exports = { RegistrarUsuario, BuscarUsuario, BuscarUsuarioPorID, helloword};
