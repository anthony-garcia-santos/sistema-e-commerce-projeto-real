

const Usuarios = require('../models/UserModel');
const bcrypt = require('bcryptjs');


const helloword = async (req, res) => {

    res.send("API no ar");

}





const RegistrarUsuario = async (req, res) => {

    const { nome, email, senha } = req.body;
    const usuarioExistente = await Usuarios.findOne({ email });

    if (usuarioExistente) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
    }

    try {
        const novoUsuario = new Usuarios({ nome, email, senha: await bcrypt.hash(senha, 10), role: 'user', });

        await novoUsuario.save();
        res.status(201).json({ message: "Usuário registrado com sucesso!" });

    } catch (erro) {
        console.error("Erro ao salvar no MongoDB:", erro);
        res.status(500).json({ message: "Erro interno ao salvar no banco de dados" });
    }
};






const BuscarUsuario = async (req, res) => {
    try {
        const usuarios = await Usuarios.find({}, "-senha");
        console.log(usuarios);
        res.json(usuarios);
    } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);
        res.status(401).json({ message: "Erro ao buscar usuários no banco de dados" });
    }
};


module.exports = { RegistrarUsuario, BuscarUsuario, helloword };
