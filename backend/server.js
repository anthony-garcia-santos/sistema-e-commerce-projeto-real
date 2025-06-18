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
console.log("CartRoutes carregado com sucesso:", CartRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));


  
const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = isProd
  ? ['https://sistema-e-commerce-projeto-real.onrender.com']
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
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


app.use("/api", CartRoutes)
app.use("/api", UploadRoutes)
app.use("/api", userRoutes);
app.use("/api", ProductRoutes);



const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/api`);
});
