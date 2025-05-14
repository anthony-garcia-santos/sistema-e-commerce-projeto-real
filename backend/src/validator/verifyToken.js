//backend/src/validator/verifyToken.js

const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token recebido:', token); // 👈 Novo log

  if (!token) {
    console.log('Nenhum token encontrado!');
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      console.error("Token inválido:", err);
      return res.status(403).json({ mensagem: 'Token inválido.' });
    }

    req.usuario = usuario;
    next();
  });
};









const verificarAdmin = (req, res, next) => {
  if (req.usuario.role === 'admin') {
    console.log(`Usuário ${req.usuario.email} acessou como admin`);
    next();
  } else {(req.usuario.role !== 'admin')
    console.log(`Usuário ${req.usuario.email} logou como usuario`);
    next();
  }
};
module.exports = { verificarToken, verificarAdmin };