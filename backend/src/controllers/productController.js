const produto = require('../models/productmodel')


exports.criarProduto = async (req, res) => {

    try {
        const { nome, preco, imagem, descricao } = req.body;
        const novoProduto = new produto({ nome, preco, imagem, descricao });
        await novoProduto.save();

        res.status(201).json(novoProduto)




    } catch (error) { res.status(500).json({ error: 'Erro ao criar produto' }) }
};

exports.listarProdutos = async (req, res) => {

    try {
        const produtos = await produto.find();
        res.json(produtos)



    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' })

    };
}