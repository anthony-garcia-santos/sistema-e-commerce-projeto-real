import axios from "axios";

let baseURL;

if (import.meta.env.MODE === 'development') {
  baseURL = 'http:
} else {
  baseURL = import.meta.env.VITE_API_URL || 'https:
}

baseURL = baseURL.replace(/\/api$/, '');

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, 
});

export default api;