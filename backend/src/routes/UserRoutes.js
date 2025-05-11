//backend/src/routes/UserRoutes.js

const express = require('express');
const { RegistrarUsuario, BuscarUsuario, BuscarUsuarioPorID, helloword } = require('../controllers/RegisterController');
const { validateRegister, validateLogin } = require('../validator/ValidatorUsers');
const controllerAdmin = require('../controllers/adm'); // sem chaves
const { verificarToken, verificarAdmin } = require('../validator/verifyToken');
const { LogarUsuario } = require("../controllers/LoginController");

const router = express.Router();

// Teste de rota básica
router.get('/', helloword);

// Rota de registro com validação
router.post('/registrar', validateRegister, RegistrarUsuario);

// Rota de login com validação
router.post('/login', LogarUsuario);

// Rota para listar todos os usuários (sem senhas)
router.get('/usuarios', BuscarUsuario);

// Rota para buscar um usuário por ID
router.get('/:id', BuscarUsuarioPorID);


router.get('/admin', verificarToken, verificarAdmin, controllerAdmin);


module.exports = router;
