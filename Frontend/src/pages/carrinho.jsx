import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione esta importação
import { verificarUsuarioLogado, buscarCarrinho } from '../../src/services/authService';

export default function Carrinho() {
    const navigate = useNavigate(); // Agora está definido
    const [carrinho, setCarrinho] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const obterUsuario = async () => {
            try {
                const user = await verificarUsuarioLogado();
                setUserId(user._id);
            } catch (error) {
                setErro("Usuário não autenticado");
                setLoading(false);
            }
        };

        obterUsuario();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const carregarCarrinho = async () => {
            try {
                const data = await buscarCarrinho(userId);
                console.log('Dados do carrinho:', data);
                setCarrinho(data);
            } catch (error) {
                setErro("Erro ao carregar carrinho");
            } finally {
                setLoading(false);
            }
        };

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

            {carrinho.items.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <ul>
                    {carrinho.items.map(item => (
                        <li key={item._id} className="mb-4 border p-3 rounded">
                            <p>Produto ID: {item.productId}</p>
                            <p>Quantidade: {item.quantity}</p>
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={() => navigate('/')}
                className="mt-5 bg-orange-500 px-4 py-2 rounded text-white"
            >
                Continuar comprando
            </button>
        </div>
    );
}