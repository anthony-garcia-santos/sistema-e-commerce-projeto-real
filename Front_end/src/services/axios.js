import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ou seu domínio se for deploy
  timeout: 5000,
});

export default api;




