//src/routes/UserRoutes.js

const express = require('express');
const { registerUser, getUsers, getUserById, helloword } = require('../controllers/UserController');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para listar todos os usuários
router.get('/', helloword);

router.get("/usuarios", getUsers)

// Rota para buscar um usuário por ID
router.get('/:id', getUserById);

module.exports = router;
