//backend/src/routes/UserRoutes.js

const express = require('express');
const { RegistrarUsuario, BuscarUsuario, BuscarUsuarioPorID, helloword } = require('../controllers/RegisterController');
const { validateRegister, validateLogin } = require('../validator/ValidatorUsers');
const controllerAdmin = require('../controllers/adm'); // sem chaves
const { verificarToken, verificarAdmin } = require('../validator/verifyToken');
const { LogarUsuario } = require("../controllers/LoginController");

const router = express.Router();

router.get('/', helloword);

router.post('/registrar', validateRegister, RegistrarUsuario);

router.post('/login', LogarUsuario);

router.get('/usuarios', BuscarUsuario);

router.get('/:id', BuscarUsuarioPorID);


router.get('/admin', verificarToken, verificarAdmin, controllerAdmin);


module.exports = router;
