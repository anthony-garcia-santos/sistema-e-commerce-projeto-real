// Front_end/src/services/authService.js

import api from "/src/services/axios.js";

export const registrarUsuario = (dados) => {
  return api.post("/api/registrar", dados);
};

export const logarUsuario = ({ email, senha }) => {
  return api.post("/api/login", { email, senha }, { withCredentials: true });
};

export const verificarUsuarioLogado = async () => {
  const response = await api.get('/api/verificar', {
    withCredentials: true
  });
  return response.data;
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
    return response.data || [];
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};


export const produtoId = async (id) => {
  try {
    const respostaProduto = await api.get(`/api/produtos/${id}`, {
      withCredentials: true,
      credentials: "include"
    });

    return respostaProduto.data;

  } catch (error) {
    console.error("Erro na vitrine do produto", error);
    throw new Error("Usuário não autorizado");
  }
};


