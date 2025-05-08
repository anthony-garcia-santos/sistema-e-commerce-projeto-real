//src/middleware/validationlogin.js

const express = require('express');
const { loginUser } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

// Rota para login
router.post('/login', [
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isLength({ min: 6 }).withMessage("A senha precisa ter no mínimo 6 caracteres.")
], loginUser);

module.exports = router;
