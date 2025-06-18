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
                console.log('Usuário logado:', user);

                setUserId(user.usuario._id);
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

                setLoading(true);

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




    const atualizarQuantidade = (productId, operacao) => {
        setCarrinho(prevCarrinho => {
            const novosItems = prevCarrinho.items.map(item => {
                if (item.productId._id === productId) {
                    const novaQuantidade =
                        operacao === 'incrementar'
                            ? item.quantity + 1
                            : Math.max(item.quantity - 1, 1); // Não deixa cair pra zero
                    return { ...item, quantity: novaQuantidade };
                }
                return item;
            });

            return { ...prevCarrinho, items: novosItems };
        });
    };





    if (loading) {
        return <p>Carregando...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-2xl mb-4">Seu Carrinho</h1>

            {carrinho.items.map(item => (
                <div key={item._id} className="mb-4 border p-10 rounded">
                    
                    <p>Produto: {item.productId.nome}</p>

                    <div className='flex-row'>

                        <div className="flex items-center gap-2">

                            <p>Preço: R$ {item.productId.preco}</p>

                            <button
                                onClick={() => atualizarQuantidade(item.productId._id, 'decrementar')}
                                className="px-2 py-1 bg-gray-300 rounded"
                            >
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() => atualizarQuantidade(item.productId._id, 'incrementar')}
                                className="px-2 py-1 bg-gray-300 rounded"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={() => navigate('/')}
                className="mt-5 bg-orange-500 px-4 py-2 rounded text-white"
            >
                Continuar comprando
            </button>
        </div>
    );
}