// backend/src/controllers/admin.js
const controllerAdmin = (req, res) => {
  res.json({ 
    success: true,
    user: req.usuario // Retorna info do usuário logado
  });
};

module.exports = controllerAdmin;