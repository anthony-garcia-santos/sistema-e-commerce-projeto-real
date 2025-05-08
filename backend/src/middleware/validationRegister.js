//src/middleware/validationRegister.js


const { body } = require('express-validator');

// Exemplo de middleware para validar o corpo da requisição
const validateRegister = [
    body("nome").notEmpty().withMessage("Nome é obrigatório."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isLength({ min: 6 }).withMessage("A senha precisa ter no mínimo 6 caracteres.")
];

module.exports = { validateRegister };
