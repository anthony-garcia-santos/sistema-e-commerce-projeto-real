//backend/server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRoutes = require('./src/routes/UserRoutes');
const ProductRoutes = require('./src/routes/productsRoutes');
const UploadRoutes = require('./src/routes/UploadRoutes')
const CartRoutes = require('./src/routes/CartRoutes')

const pagamento = require('./src/routes/pagamento')

console.log("CartRoutes carregado com sucesso:", CartRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));



// Substitua a configuração atual do CORS por esta:

const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = isProd
  ? ['https://sistema-e-commerce-projeto-real.onrender.com']
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como mobile apps ou curl requests)
    if (!origin) return callback(null, true);

    // Verifica se a origem está na lista de permitidas ou se é um ambiente de desenvolvimento
    if (allowedOrigins.includes(origin) || !isProd) {
      return callback(null, true);
    }

    // Para produção, rejeita origens não listadas
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200 // Alguns navegadores antigos (IE11) têm problemas com 204
}));




app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  );
  next();
});


app.use("/api", CartRoutes);
app.use("/api", UploadRoutes);
app.use("/api", userRoutes);
app.use("/api", ProductRoutes);
app.use("/api", pagamento);


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/api`);
});
