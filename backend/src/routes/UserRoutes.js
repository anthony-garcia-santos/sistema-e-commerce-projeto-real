const express = require('express');
const { RegistrarUsuario, BuscarUsuario, helloword } = require('../controllers/RegisterController');
const { validateRegister, validateLogin } = require('../validator/ValidatorUsers');
const { verificarToken, verificarAdmin } = require('../validator/verifyToken');
const { LogarUsuario, LogoutUsuario } = require("../controllers/LoginController");
const rateLimit = require('express-rate-limit');
const controllerAdmin = require('../controllers/ControllersAdmin');

// Limiter aplicado APENAS ao login (5 tentativas em 15 minutos)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: "Muitas tentativas de login. Tente novamente mais tarde."
});

const router = express.Router();

// Rotas
router.get('/', helloword);
router.post('/registrar', validateRegister, RegistrarUsuario);
router.post('/login', loginLimiter, LogarUsuario);
router.post('/logout', LogoutUsuario);
router.get('/usuarios', BuscarUsuario);
router.get('/admin', verificarToken, verificarAdmin, controllerAdmin);

module.exports = router;