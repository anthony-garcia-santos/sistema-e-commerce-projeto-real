//backend/server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRoutes = require('./src/routes/UserRoutes');

const { validateRegister, validateLogin } = require('./src/validator/ValidatorUsers');


const app = express();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Conectado ao MongoDB Atlas"))
    .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // 👈 Isso é ESSENCIAL!
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", userRoutes);


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/api`);
});
