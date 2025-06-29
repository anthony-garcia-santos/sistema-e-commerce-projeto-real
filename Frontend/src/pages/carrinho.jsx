import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarUsuarioLogado, buscarCarrinho } from '../../src/services/authService';
import { removerItemCarrinho } from '../../src/services/authService';

export default function Carrinho() {
    const navigate = useNavigate();
    const [carrinho, setCarrinho] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const obterUsuario = async () => {
            try {
                const user = await verificarUsuarioLogado();
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
        setCarrinho(prev => {
            const novosItems = prev.items.map(item => {
                if (item.productId._id === productId) {
                    const novaQtd = operacao === 'incrementar'
                        ? item.quantity + 1
                        : Math.max(item.quantity - 1, 1);
                    return { ...item, quantity: novaQtd };
                }
                return item;
            });
            return { ...prev, items: novosItems };
        });
    };

    

    const handleRemoverItem = async (produtoId) => {
        try {
            const novoCarrinho = await removerItemCarrinho(produtoId);
            setCarrinho(novoCarrinho);
        } catch (error) {
            console.error("Erro ao remover item:", error);
        }
    };

    const calcularTotal = () => {
        return carrinho.items.reduce((total, item) => total + (item.productId.preco * item.quantity), 0).toFixed(2);
    };

    if (loading) return <p>Carregando...</p>;
    if (erro) return <p>{erro}</p>;

    return (
        <div className="relative flex min-h-screen flex-col bg-[#fcfaf8] overflow-x-hidden" style={{ fontFamily: "'Be Vietnam Pro', 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex flex-col flex-1">
                <header className="flex items-center justify-between border-b border-[#f4eee7] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c150d]">

                        <h1 className="text-left relative right-8" style={{
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                            lineHeight: '21px',
                        }}> Lolo_Personalizado</h1>                    </div>

                </header>

                <main className="flex justify-center py-5 px-6">
                    <div className="max-w-[920px] w-full">
                        <h1 className="text-[32px] font-bold mb-4 text-[#1c150d]">Cart ({carrinho.items.length})</h1>

                        {carrinho.items.map(item => (
                            <div key={item._id} className="flex justify-between items-start gap-4 bg-[#fcfaf8] px-4 py-3 mb-3 border rounded-md">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg w-[70px]"
                                        style={{ backgroundImage: `url(${item.productId.imagem || 'https:
                                    />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[#1c150d] text-base font-medium">{item.productId.nome}</p>
                                        <p className="text-[#9c7849] text-sm">${item.productId.preco}</p>
                                        {item.productId.tamanho && (
                                            <p className="text-[#9c7849] text-sm">Size: {item.productId.tamanho}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[#1c150d]">
                                    <button onClick={() => atualizarQuantidade(item.productId._id, 'decrementar')} className="h-7 w-7 bg-[#f4eee7] rounded-full flex items-center justify-center">−</button>
                                    <input
                                        className="w-8 text-center bg-transparent"
                                        type="number"
                                        value={item.quantity}
                                        readOnly
                                    />
                                    <button onClick={() => atualizarQuantidade(item.productId._id, 'incrementar')} className="h-7 w-7 bg-[#f4eee7] rounded-full flex items-center justify-center">+</button>

                                    {}
                                    <button
                                        onClick={() => handleRemoverItem(item.productId._id)}
                                        className="ml-2 text-red-600 text-sm underline"
                                    >
                                        Remover
                                    </button>
                                </div>

                            </div>
                        ))}

                        <div className="p-4 mt-6 bg-white border rounded-md">
                            <h3 className="text-lg font-bold mb-3 text-[#1c150d]">Resumo do Pedido</h3>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#9c7849] text-sm">Total</span>
                                <span className="text-[#1c150d] text-sm">${calcularTotal()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#9c7849] text-sm">Frete</span>
                                <span className="text-[#1c150d] text-sm">Grátis</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#9c7849] text-sm">Desconto</span>
                                <span className="text-[#1c150d] text-sm">Nenhum</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#9c7849] text-sm">Total Estimado</span>
                                <span className="text-[#1c150d] text-sm">${calcularTotal()}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="h-12 px-5 rounded-full bg-[#f28f0d] text-[#1c150d] font-bold cursor-pointer"
                                onClick={() => navigate('/pagamento', {
                                    state: {
                                        carrinho: {
                                            ...carrinho,
                                            total: calcularTotal()
                                        }
                                    }
                                })}
                            >
                                Finalizar Compra
                            </button>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm text-blue-600 underline cursor-pointer"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
