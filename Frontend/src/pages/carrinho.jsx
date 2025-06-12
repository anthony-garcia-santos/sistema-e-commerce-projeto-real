import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarUsuarioLogado, buscarCarrinho } from '../../src/services/authService';

export default function Carrinho() {

    const navigate = useNavigate();
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!userId) return; // evita chamada com undefined

        async function carregarCarrinho() {
            try {
                const response = await axios.get(`/api/cart/${userId}`);
                setCarrinho(response.data);
            } catch (error) {
                console.error("Erro ao carregar carrinho:", error);
            }
        }

        carregarCarrinho();
    }, [userId]);


    if (loading) {
        return <p>Carregando...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl mb-4">Seu Carrinho</h1>

            {itens.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <ul>
                    {itens.map(item => (
                        <li key={item._id} className="mb-4 border p-3 rounded">
                            <p>Produto ID: {item.productId}</p>
                            <p>Quantidade: {item.quantity}</p>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate('/')} className="mt-5 bg-orange-500 px-4 py-2 rounded text-white">
                Continuar comprando
            </button>
        </div>
    );
}
