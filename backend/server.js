const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Importações de rotas
const userRoutes = require('./src/routes/UserRoutes');
const ProductRoutes = require('./src/routes/productsRoutes');
const UploadRoutes = require('./src/routes/UploadRoutes');
const CartRoutes = require('./src/routes/CartRoutes');
const pagamento = require('./src/routes/pagamento');

const allowedOrigins = [
  'https://localhost:5173',
  'http://localhost:5173',
  'http://localhost:58958',
  'http://localhost:59141',
  'http://26.2.206.208:58958',
  'http://127.0.0.1:5173',
  'https://sistema-e-commerce-projeto-real.onrender.com',
  'http://localhost:59627'
];

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro));

app.use('/api/webhook', express.raw({ type: 'application/json' }));

app.use(session({
  secret: 'seu-segredo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Middleware CORS configurado com origin dinâmico
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, origin); // Define o header Access-Control-Allow-Origin igual ao origin da requisição
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", CartRoutes);
app.use("/api", UploadRoutes);
app.use("/api", userRoutes);
app.use("/api", ProductRoutes);
app.use("/api", pagamento);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/api`);
});
