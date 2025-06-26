import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '/src/services/axios.js';

export default function Pagamento() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();

    // Obter dados do carrinho do estado de navegação
    const carrinho = location.state?.carrinho || { items: [] };

    // Calcular totais baseados no carrinho
    const calcularTotais = () => {
        const subtotal = carrinho.items.reduce((total, item) =>
            total + (item.productId.preco * item.quantity), 0);
        const frete = subtotal > 100 ? 0 : 5.00;
        const taxas = subtotal * 0.1;
        const total = subtotal + frete + taxas;

        return { subtotal, frete, taxas, total };
    };

    const [resumoPedido, setResumoPedido] = useState(calcularTotais());
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    useEffect(() => {
        setResumoPedido(calcularTotais());
    }, [carrinho]);

    // Verificar se o carrinho está vazio
    useEffect(() => {
        if (carrinho.items.length === 0) {
            navigate('/carrinho');
        }
    }, [carrinho, navigate]);

    // Dados do pagamento
    const [dadosPagamento, setDadosPagamento] = useState({
        nomeCartao: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        metodoPagamento: 'creditCard'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosPagamento(prev => ({ ...prev, [name]: value }));
    };

    const handleMetodoPagamento = (metodo) => {
        setDadosPagamento(prev => ({ ...prev, metodoPagamento: metodo }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPaymentError(null);

        try {
            // 1. Criar payment intent no backend
            const { data } = await api.post('/api/create-payment-intent', {
                total: resumoPedido.total,
                metodo: dadosPagamento.metodoPagamento,
                itens: carrinho.items,
                endereco: dadosPagamento
            });

            // 2. Processar pagamento conforme método selecionado
            if (dadosPagamento.metodoPagamento === 'creditCard') {
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    clientSecret: data.clientSecret,
                    confirmParams: {
                        return_url: `${window.location.origin}/confirmacao`,
                        payment_method_data: {
                            billing_details: {
                                name: dadosPagamento.nomeCartao,
                                address: {
                                    line1: dadosPagamento.endereco,
                                    city: dadosPagamento.cidade,
                                    state: dadosPagamento.estado,
                                    postal_code: dadosPagamento.cep
                                }
                            }
                        }
                    },
                    redirect: 'if_required'
                });

                if (error) throw error;
                
                navigate('/confirmacao', {
                    state: {
                        pedido: {
                            dadosPagamento,
                            itens: carrinho.items,
                            total: resumoPedido.total,
                            idPagamento: paymentIntent.id
                        }
                    }
                });
            } 
            else if (dadosPagamento.metodoPagamento === 'pix') {
                navigate('/pix', {
                    state: {
                        qrCode: data.pix_qr_code,
                        pedido: {
                            dadosPagamento,
                            itens: carrinho.items,
                            total: resumoPedido.total,
                            idPagamento: data.paymentIntentId
                        }
                    }
                });
            }
            else {
                // Para PayPal ou outros métodos
                window.location.href = data.approval_url;
            }
        } catch (error) {
            console.error('Erro no pagamento:', error);
            setPaymentError(error.message || 'Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-[#fcfaf8] overflow-x-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex flex-col flex-1">
                <header className="flex items-center justify-between border-b border-[#f4eee7] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c150d]">
                        <h2 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em]">Lolo_Personalizado</h2>
                    </div>
                </header>

                <main className="px-6 md:px-40 flex flex-1 justify-center py-5">
                    <div className="w-full max-w-[920px]">
                        <div className="flex flex-wrap gap-2 p-4">
                            <button href="#" className="text-[#9c6f49] text-base font-medium leading-normal cursor-pointer"
                                onClick={() => navigate(`/carrinho`)}
                            >Carrinho</button>

                            <span className="text-[#9c6f49] text-base font-medium leading-normal">/</span>
                            <span className="text-[#1c140d] text-base font-medium leading-normal">Pagamento</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <p className="text-[#1c140d] text-[32px] font-bold leading-tight min-w-72">Pagamento</p>
                        </div>

                        {paymentError && (
                            <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-md">
                                {paymentError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Itens do Pedido */}
                            <h3 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Itens do Pedido</h3>

                            <div className="p-4 bg-white border border-[#e8dace] rounded-md mb-4">
                                {carrinho.items.map(item => (
                                    <div key={item._id} className="flex justify-between py-2 border-b border-[#e8dace] last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 bg-cover bg-center rounded"
                                                style={{ backgroundImage: `url(${item.productId.imagem || 'https://via.placeholder.com/70'})` }}
                                            />
                                            <div>
                                                <p className="text-[#1c140d] text-sm font-medium">{item.productId.nome}</p>
                                                <p className="text-[#9c6f49] text-xs">Quantidade: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-[#1c140d] text-sm font-medium">
                                            R$ {(item.productId.preco * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Método de Pagamento */}
                            <h3 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Método de Pagamento</h3>
                            <div className="flex flex-col gap-3 p-4">
                                <label className={`flex items-center gap-4 rounded-lg border border-solid p-[15px] flex-row-reverse 
                                    ${dadosPagamento.metodoPagamento === 'creditCard' ? 'border-[#f38124] bg-[#fef6f0]' : 'border-[#e8dace]'}`}>
                                    <input
                                        type="radio"
                                        className="h-5 w-5 border-2 border-[#e8dace] bg-transparent text-transparent checked:border-[#f38124] checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTYgMTYnIGZpbGw9J3JnYigyNDMsMTI5LDM2KScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48Y2lyY2xlIGN4PSc4JyBjeT0nOCcgcj0nMycvPjwvc3ZnPg==')] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#f38124]"
                                        name="metodoPagamento"
                                        checked={dadosPagamento.metodoPagamento === 'creditCard'}
                                        onChange={() => handleMetodoPagamento('creditCard')}
                                    />
                                    <div className="flex grow flex-col">
                                        <p className="text-[#1c140d] text-sm font-medium leading-normal">Cartão de Crédito</p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 rounded-lg border border-solid p-[15px] flex-row-reverse 
                                    ${dadosPagamento.metodoPagamento === 'pix' ? 'border-[#f38124] bg-[#fef6f0]' : 'border-[#e8dace]'}`}>
                                    <input
                                        type="radio"
                                        className="h-5 w-5 border-2 border-[#e8dace] bg-transparent text-transparent checked:border-[#f38124] checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTYgMTYnIGZpbGw9J3JnYigyNDMsMTI5LDM2KScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48Y2lyY2xlIGN4PSc4JyBjeT0nOCcgcj0nMycvPjwvc3ZnPg==')] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#f38124]"
                                        name="metodoPagamento"
                                        checked={dadosPagamento.metodoPagamento === 'pix'}
                                        onChange={() => handleMetodoPagamento('pix')}
                                    />
                                    <div className="flex grow flex-col">
                                        <p className="text-[#1c140d] text-sm font-medium leading-normal">PIX</p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 rounded-lg border border-solid p-[15px] flex-row-reverse 
                                    ${dadosPagamento.metodoPagamento === 'paypal' ? 'border-[#f38124] bg-[#fef6f0]' : 'border-[#e8dace]'}`}>
                                    <input
                                        type="radio"
                                        className="h-5 w-5 border-2 border-[#e8dace] bg-transparent text-transparent checked:border-[#f38124] checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTYgMTYnIGZpbGw9J3JnYigyNDMsMTI5LDM2KScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48Y2lyY2xlIGN4PSc4JyBjeT0nOCcgcj0nMycvPjwvc3ZnPg==')] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#f38124]"
                                        name="metodoPagamento"
                                        checked={dadosPagamento.metodoPagamento === 'paypal'}
                                        onChange={() => handleMetodoPagamento('paypal')}
                                    />
                                    <div className="flex grow flex-col">
                                        <p className="text-[#1c140d] text-sm font-medium leading-normal">PayPal</p>
                                    </div>
                                </label>
                            </div>

                            {/* Dados do Cartão (visível apenas se cartão de crédito selecionado) */}
                            {dadosPagamento.metodoPagamento === 'creditCard' && (
                                <>
                                    <div className="p-4 bg-white border border-[#e8dace] rounded-md mb-4">
                                        <CardElement 
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#1c140d',
                                                        '::placeholder': {
                                                            color: '#9c6f49',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-[#1c140d] text-base font-medium leading-normal pb-2">Nome no Cartão</p>
                                            <input
                                                name="nomeCartao"
                                                placeholder="Digite o nome como aparece no cartão"
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c140d] focus:outline-0 focus:ring-0 border border-[#e8dace] bg-[#fcfaf8] focus:border-[#f38124] h-14 placeholder:text-[#9c6f49] p-[15px] text-base font-normal leading-normal"
                                                value={dadosPagamento.nomeCartao}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Endereço de Cobrança */}
                            <h3 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Endereço de Cobrança</h3>
                            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#1c140d] text-base font-medium leading-normal pb-2">Endereço</p>
                                    <input
                                        name="endereco"
                                        placeholder="Digite seu endereço"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c140d] focus:outline-0 focus:ring-0 border border-[#e8dace] bg-[#fcfaf8] focus:border-[#f38124] h-14 placeholder:text-[#9c6f49] p-[15px] text-base font-normal leading-normal"
                                        value={dadosPagamento.endereco}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#1c140d] text-base font-medium leading-normal pb-2">Cidade</p>
                                    <input
                                        name="cidade"
                                        placeholder="Digite sua cidade"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c140d] focus:outline-0 focus:ring-0 border border-[#e8dace] bg-[#fcfaf8] focus:border-[#f38124] h-14 placeholder:text-[#9c6f49] p-[15px] text-base font-normal leading-normal"
                                        value={dadosPagamento.cidade}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#1c140d] text-base font-medium leading-normal pb-2">Estado</p>
                                    <input
                                        name="estado"
                                        placeholder="Selecione seu estado"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c140d] focus:outline-0 focus:ring-0 border border-[#e8dace] bg-[#fcfaf8] focus:border-[#f38124] h-14 placeholder:text-[#9c6f49] p-[15px] text-base font-normal leading-normal"
                                        value={dadosPagamento.estado}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#1c140d] text-base font-medium leading-normal pb-2">CEP</p>
                                    <input
                                        name="cep"
                                        placeholder="Digite seu CEP"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c140d] focus:outline-0 focus:ring-0 border border-[#e8dace] bg-[#fcfaf8] focus:border-[#f38124] h-14 placeholder:text-[#9c6f49] p-[15px] text-base font-normal leading-normal"
                                        value={dadosPagamento.cep}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>

                            {/* Resumo do Pedido */}
                            <h3 className="text-[#1c140d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Resumo do Pedido</h3>
                            <div className="p-4 bg-white border border-[#e8dace] rounded-md">
                                <div className="flex justify-between gap-x-6 py-2">
                                    <p className="text-[#9c6f49] text-sm font-normal leading-normal">Subtotal</p>
                                    <p className="text-[#1c140d] text-sm font-normal leading-normal text-right">R$ {resumoPedido.subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between gap-x-6 py-2">
                                    <p className="text-[#9c6f49] text-sm font-normal leading-normal">Frete</p>
                                    <p className="text-[#1c140d] text-sm font-normal leading-normal text-right">R$ {resumoPedido.frete.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between gap-x-6 py-2">
                                    <p className="text-[#9c6f49] text-sm font-normal leading-normal">Taxas</p>
                                    <p className="text-[#1c140d] text-sm font-normal leading-normal text-right">R$ {resumoPedido.taxas.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between gap-x-6 pt-2 border-t border-[#e8dace] mt-2">
                                    <p className="text-[#1c140d] text-base font-bold leading-normal">Total</p>
                                    <p className="text-[#1c140d] text-base font-bold leading-normal text-right">R$ {resumoPedido.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex justify-stretch mt-6">
                                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                                    <button
                                        type="button"
                                        className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#f4ede7] text-[#1c140d] text-base font-bold leading-normal tracking-[0.015em] transition hover:bg-[#e8dace]"
                                        onClick={() => navigate(-1)}
                                    >
                                        <span className="truncate">Voltar</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className="flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#f38124] text-[#1c140d] text-base font-bold leading-normal tracking-[0.015em] transition hover:bg-[#e5721b]"
                                        disabled={!stripe || loading}
                                    >
                                        {loading ? 'Processando...' : 'Confirmar Pagamento'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}