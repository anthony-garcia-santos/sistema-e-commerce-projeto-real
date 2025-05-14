//Front_end/src/services/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  withCredentials: true // Habilita o envio automático de cookies
  
});

export default api;




