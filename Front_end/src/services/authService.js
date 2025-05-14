// Front_end/src/services/authService.js

import api from "/src/services/axios.js";

export const registrarUsuario = (dados) => {
  return api.post("/api/registrar", dados);
};

export const logarUsuario = ({ email, senha }) => {
  return api.post("/api/login", { email, senha }, { withCredentials: true });
};




export const obterAdminData = async () => {
  try {
    // Adicione /api antes da rota
    const response = await api.get("/api/admin", { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    throw error;
  }
};


export const logoutUsuario = () => {
  return api.post("/api/logout", {}, { withCredentials: true });
};
