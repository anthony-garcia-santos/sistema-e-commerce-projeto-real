import axios from "axios";

let baseURL;

if (import.meta.env.MODE === 'development') {
  // Quando rodando localmente no npm run dev
  baseURL = 'http://localhost:3000';
} else {
  // Quando rodando no Render (deploy)
  baseURL = import.meta.env.VITE_API_URL || 'https://api-lolopersonalizado.onrender.com';
}

// Garantia extra: tirar eventual /api duplicado da VITE_API_URL
baseURL = baseURL.replace(/\/api$/, '');

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

export default api;
