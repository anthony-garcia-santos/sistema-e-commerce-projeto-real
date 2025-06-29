
const controllerAdmin = (req, res) => {
  res.json({ 
    success: true,
    user: req.usuario 
  });
};

module.exports = controllerAdmin;