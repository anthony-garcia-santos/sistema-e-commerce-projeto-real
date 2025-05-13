// Front_end/src/services/authService.js

import api from "/src/services/axios.js";

export const registrarUsuario = (dados) => {
  return api.post("/api/registrar", dados);
};

export const logarUsuario = ({ email, senha }) => {
  return api.post("/api/login", { email, senha });
};

export const obterAdminData = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("Token não encontrado! O usuário não está autenticado.");
    return;
  }

  return api.get("/api/admin", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    console.log("Dados do admin:", response.data);
  })
  .catch(error => {
    console.error("Erro ao acessar dados do admin:", error);
  });
};


