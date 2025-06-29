const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session"); // Adicione esta linha
const cookieParser = require("cookie-parser");
require("dotenv").config();


const app = express();




// Importações de rotas
const userRoutes = require('./src/routes/UserRoutes');
const ProductRoutes = require('./src/routes/productsRoutes');
const UploadRoutes = require('./src/routes/UploadRoutes');
const CartRoutes = require('./src/routes/CartRoutes');
const pagamento = require('./src/routes/pagamento');
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = [
  'https://localhost:5173', 
  'http://localhost:5173',  
  'http://127.0.0.1:5173',
  'https://sistema-e-commerce-projeto-real.onrender.com'
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





app.use(cors({
  origin: allowedOrigins,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/api`);
});