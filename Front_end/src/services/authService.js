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




export const criarProduto = (dados) => {
  return api.post('/api/produtos', dados, { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const listarProdutos = async () => {
  try {
    const response = await api.get("/api/produtos", {
      withCredentials: true
    });
    return response.data || []; // Retorna array vazio se response.data for undefined
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};
