//Front_end/src/services/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true,
});

export default api;


