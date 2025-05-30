const express = require('express');
const multer = require('multer');
const { verificarAdmin } = require('../validator/verifyAdmin');
const { UploadController } = require('../controllers/ControllerUpload');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', verificarAdmin, upload.single('imagem'), UploadController);

module.exports = router;
