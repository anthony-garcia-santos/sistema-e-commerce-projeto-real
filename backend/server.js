const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Importação das rotas e validações
const userRoutes = require('./src/routes/UserRoutes');
const { validateRegister, validateLogin } = require('./src/validator/ValidatorUsers');

const app = express();

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado ao MongoDB Atlas"))
    .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas
app.use("/", userRoutes);

// Rotas de autenticação com validação
app.post("/api/auth/register", validateRegister, require('./src/controllers/RegisterController').RegistrarUsuario);
app.post("/api/auth/login", validateLogin, require('./src/controllers/LoginController').LogarUsuario);

// Inicializa o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
