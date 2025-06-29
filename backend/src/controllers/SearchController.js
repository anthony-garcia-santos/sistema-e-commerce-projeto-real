
import produtoModel from '../models/productmodel.js';

const buscarProduto = async (req, res) => {
    const q = (req.query.q || "").trim();

    const filtro = q
        ? {
            $or: [
                { nome: { $regex: q, $options: "i" } },
                { descricao: { $regex: q, $options: "i" } },
            ],
        }
        : {};

    try {
        const produtos = await produtoModel.find(filtro).limit(100);
        res.json(produtos);
    } catch (err) {
        console.error("erro na busca", err);
        res.status(500).json({
            mensagem: "erro ao buscar produto",
            erro: err.message
        });
    }
};

export { buscarProduto };