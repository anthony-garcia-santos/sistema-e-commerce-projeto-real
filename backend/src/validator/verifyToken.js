//backend/src/validator/verifyToken.js

const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido.' });

        req.usuario = usuario; // adiciona o usuário decodificado ao req
        next();
    });
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ mensagem: 'Acesso negado' });
  }
};

module.exports = { verificarToken, verificarAdmin };