//backend/server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Importação das rotas e validações
const userRoutes = require('./src/routes/UserRoutes');

const { validateRegister, validateLogin } = require('./src/validator/ValidatorUsers');
const controllerAdmin = require('./src/controllers/adm');


const app = express();

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado ao MongoDB Atlas"))
    .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas
app.use("/api", userRoutes);


// Inicializa o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
