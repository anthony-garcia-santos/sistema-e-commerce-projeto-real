
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verificarUsuario = async (req, res, next) => {
  
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    req.usuario = usuario; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { verificarUsuario };
