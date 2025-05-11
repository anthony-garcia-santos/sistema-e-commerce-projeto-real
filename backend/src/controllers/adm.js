//backend/src/controllers/adm.js
const controllerAdmin = async (req, res) => {
  res.json({ mensagem: 'Painel do administrador' });
};

module.exports = controllerAdmin; // exporta direto a função
