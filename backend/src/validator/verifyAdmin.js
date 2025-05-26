const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verificarAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (usuario.role !== 'admin') {
      console.log(`Usuário ${usuario.email} tentou acessar como admin`);
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    req.usuario = usuario;
    console.log(`Usuário ${usuario.email} acessou como admin`);
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { verificarAdmin };
