// Front_end/src/services/authService.js
import api from "../services/axios";  // Corrija o caminho

export const registrarUsuario = (dados) => {
  return api.post("/registrar", dados);  // Usando a instância "api" configurada
};
