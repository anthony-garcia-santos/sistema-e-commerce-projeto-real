//backend/src/controller/LoginController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuarios = require('../models/UserModel');

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
        }).select('+senha');

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Credenciais inválidas"
            });
        }

        const SenhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!SenhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Credenciais inválidas"
            });
        }


        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 horas
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
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({ message: 'Logout realizado com sucesso' });


    return res.status(200).json({
        sucesso: true,
        mensagem: 'Logout realizado com sucesso.'
    });
};


module.exports = { LogarUsuario, LogoutUsuario };
