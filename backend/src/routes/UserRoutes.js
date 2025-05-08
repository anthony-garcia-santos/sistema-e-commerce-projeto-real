//backend/src/routes/UserRoutes.js

const express = require('express');
const { RegistrarUsuario, BuscarUsuario, BuscarUsuarioPorID, helloword } = require('../controllers/RegisterController');
const { LogarUsuario } = require('../controllers/LoginController');
const { validateRegister, validateLogin } = require('../validator/ValidatorUsers');

const router = express.Router();

// Teste de rota básica
router.get('/', helloword);

// Rota de registro com validação
router.post('/registrar', validateRegister, RegistrarUsuario);

// Rota de login com validação
router.post('/login', validateLogin, LogarUsuario);

// Rota para listar todos os usuários (sem senhas)
router.get('/usuarios', BuscarUsuario);

// Rota para buscar um usuário por ID
router.get('/:id', BuscarUsuarioPorID);

module.exports = router;
