//backend/src/controller/LoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuarios = require('../models/UserModel');

// Função para login
const LogarUsuario = async (req, res) => {


    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({
            sucesso: false,
            erros: erros.array()
        });
    }

    const { email, senha } = req.body;

    try {
        const usuario = await Usuarios.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        }).select('+senha'); // Inclui o campo senha que está oculto por padrão

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Credenciais inválidas" // Mensagem genérica por segurança
            });
        }

        const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!SenhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Credenciais inválidas" // Mesma mensagem para não dar dicas
            });
        }



        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '1h' }
        );

        // Configura o cookie seguro
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hora
            path: '/'
        });



        // Retorna resposta SEM o token no body
        return res.status(200).json({
            sucesso: true,
            mensagem: `Bem-vindo, ${usuario.nome}!`,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });


    } catch (erro) {
        console.error("Erro no login:", erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor",
            detalhes: process.env.NODE_ENV === 'development' ? erro.message : undefined
        });
    }
};



const LogoutUsuario = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

    return res.status(200).json({
        sucesso: true,
        mensagem: 'Logout realizado com sucesso.'
    });
};


module.exports = { LogarUsuario, LogoutUsuario };
