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
    const response = await api.get("/api/produtos/lista", {
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

export const BuscarProduto = async (query = "") => {
  try {
    const res = await api.get("/api/buscar-produto", {
      params: { q: query },
    });
    return res.data;
  } catch (error) {
    console.error("erro ao buscar produto", error.response?.data || error.message);
    throw error;
  }
}





export const createCart = async (userId, userNome) => {
  const response = await api.post('/api/create', { userId, userNome });
  return response.data;
}


export const addItem = async (cartId, produtoId, quantidade) => {
  const response = await api.post('/api/add-item', { cartId, produtoId, quantidade });
  return response.data;
}

export const buscarCarrinho = async () => {
  const response = await api.get('/api/cart');
  return response.data;
};










// Front_end/src/services/uploadService.js


export const uploadImagem = async (imagem) => {
  const formData = new FormData();
  formData.append("imagem", imagem);

  const response = await api.post("/api/upload", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // { url: 'https://...cloudinary.com/...' }
};


