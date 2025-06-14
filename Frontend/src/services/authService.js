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



export const adicionarAoCarrinho = async ({ userId, productId, quantity }) => {
  try {
    console.log('Enviando requisição para adicionar ao carrinho:', {
      userId,
      productId,
      quantity
    });
    
    const response = await api.post('/api/cart/add', 
      { userId, productId, quantity }, 
      { 
        withCredentials: true,
        timeout: 10000 // 10 segundos de timeout
      }
    );
    
    console.log('Resposta do servidor:', response.data);
    return response.data;
    
  } catch (error) {
    let errorDetails = {
      message: error.message,
      code: error.code
    };
    
    if (error.response) {
      errorDetails = {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      };
    } else if (error.request) {
      errorDetails.request = error.request;
    }
    
    console.error('Erro detalhado ao adicionar ao carrinho:', errorDetails);
    throw new Error('Falha ao adicionar item ao carrinho');
  }
};

export const buscarCarrinho = async (userId) => {
  const response = await api.get(`/api/cart/${userId}`, { withCredentials: true });
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


