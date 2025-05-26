const express = require('express');
const { RegistrarUsuario, BuscarUsuario, helloword } = require('../controllers/RegisterController');
const { validateRegister} = require('../validator/ValidatorUsers');

const { verificarAdmin } = require('../validator/verifyAdmin');
const controllerAdmin = require('../controllers/ControllersAdmin');
const { verificarUsuario } = require('../validator/verifyUsers')

const { LogarUsuario, LogoutUsuario } = require("../controllers/LoginController");
const rateLimit = require('express-rate-limit');



const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: "Muitas tentativas de login. Tente novamente mais tarde."
});

const router = express.Router();


router.post('/registrar', validateRegister, RegistrarUsuario);
router.post('/login', loginLimiter, LogarUsuario);
router.post('/logout', LogoutUsuario);

router.get('/', helloword);
router.get('/usuarios', BuscarUsuario);

router.get("/verificar", verificarUsuario, (req, res) => {
  // Se chegou aqui, o usuário está autenticado
  res.status(200).json({
    message: "Usuário autenticado",
    usuario: req.usuario // Opcional: dados do usuário
  });
});

router.get('/admin', verificarAdmin, controllerAdmin);

module.exports = router;