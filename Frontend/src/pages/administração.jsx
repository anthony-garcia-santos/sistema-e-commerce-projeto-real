import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obterAdminData, criarProduto, uploadImagem, Pedidos, listarPagamento } from '../services/authService';

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        descricaoDetalhada: '',
        preco: '',
        imagem: '',
    });

    const [imagem, setImagem] = useState(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pedidosData, pagamentosData] = await Promise.all([
                    Pedidos(),
                    listarPagamento()
                ]);
                setPedidos(pedidosData);
                setPagamentos(pagamentosData.data || []);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const verificarAdmin = async () => {
            try {
                await obterAdminData();
                setIsAdmin(true);
            } catch {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        verificarAdmin();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await criarProduto({
                ...form,
                preco: parseFloat(form.preco),
                imagem: url || form.imagem,
            });
            alert('Produto cadastrado com sucesso!');
            setForm({ nome: '', descricao: '', descricaoDetalhada: '', preco: '', imagem: '' });
            setImagem(null);
            setUrl('');
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar produto');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imagem) return alert("Selecione uma imagem primeiro.");
        try {
            const resposta = await uploadImagem(imagem);
            setUrl(resposta.url);
            alert("Upload feito com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            alert("Falha no upload");
        }
    };

    if (loading) return <div className="flex justify-center mt-10">Carregando...</div>;
    if (!isAdmin) return <Navigate to="/" />;









    return (
        <div className="relative w-full min-h-screen bg-[#fcfaf8]"
            style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}>

            <div className="flex flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4eee7] px-4 md:px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c150d]">
                        <h2 className="text-[#1c150d] text-lg font-bold leading-tight tracking-[-0.015em]">
                            Lolo_Personalizado
                        </h2>
                    </div>
                </header>

                <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-5">
                    <form onSubmit={handleSubmit} className="w-full max-w-[960px] mx-auto py-5">

                        <h1 className="text-[#1c150d] text-2xl md:text-[32px] font-bold leading-tight text-center pb-3 pt-6">
                            Criar Novo Produto
                        </h1>

                        <p className="text-[#1c150d] text-base font-normal leading-normal pb-6 text-center">
                            Preencha os detalhes do produto abaixo
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                            <div className="mb-4">
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Nome do Produto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nome do produto"
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className="form-input w-full rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] h-12 md:h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Descrição Resumida
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descrição resumida"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    className="form-input w-full rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] h-12 md:h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div className="mb-4 md:col-span-2">
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Descrição Detalhada
                                </label>
                                <textarea
                                    placeholder="Descrição detalhada"
                                    value={form.descricaoDetalhada}
                                    onChange={(e) => setForm({ ...form, descricaoDetalhada: e.target.value })}
                                    className="form-input w-full rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] min-h-[100px] placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Preço
                                </label>
                                <input
                                    type="number"
                                    placeholder="Preço"
                                    value={form.preco}
                                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                                    className="form-input w-full rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] h-12 md:h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    URL da Imagem (opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="URL da imagem"
                                    value={form.imagem}
                                    onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                                    className="form-input w-full rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] h-12 md:h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div className="mb-4 space-y-3 md:col-span-2">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <label className="block">
                                        <span className="inline-block bg-[#f4eee7] hover:bg-[#e8dfd3] text-[#1c150d] font-medium px-4 py-2 rounded-xl cursor-pointer">
                                            Selecionar imagem
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImagem(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </span>
                                    </label>
                                    <button
                                        onClick={handleUpload}
                                        className="bg-[#f28f0d] hover:bg-[#e0860c] text-[#1c150d] px-6 py-2 rounded-xl font-medium"
                                    >
                                        Enviar imagem
                                    </button>
                                </div>

                                {url && (
                                    <div className="text-center mt-4">
                                        <p className="mb-2 text-[#1c150d]">Imagem enviada:</p>
                                        <img src={url} alt="Preview" className="w-32 md:w-48 mx-auto rounded-lg shadow" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex py-3 justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f28f0d] text-[#1c150d] text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate">{loading ? "Enviando..." : "Criar Produto"}</span>
                            </button>
                        </div>




                        <div className="mt-10 px-4 md:px-10">
                            <h2 className="text-xl font-bold mb-4">Pagamentos e pedidos</h2>

                            {pagamentos.length > 0 ? (
                                <div className="space-y-4">
                                    {pagamentos.map((pagamento) => {
                                        const paymentMethod = pagamento.payment_details?.card || {};
                                        const verification = pagamento.payment_details?.verification || {};

                                        return (
                                            <div key={pagamento.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                {/* Cabeçalho do card */}
                                                <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-medium text-gray-500 text-sm">ID Pagamento</p>
                                                        <p className="font-mono text-sm truncate max-w-[180px]">{pagamento.id}</p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 text-xs rounded-full ${pagamento.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                                                                pagamento.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {pagamento.status === 'succeeded' ? 'Pago' :
                                                                pagamento.status === 'pending' ? 'Pendente' :
                                                                    pagamento.status || 'Status desconhecido'}
                                                        </span>

                                                        <p className="text-lg font-bold">
                                                            R$ {pagamento.amount?.toFixed(2) || '0,00'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Corpo do card */}
                                                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Seção Cliente */}
                                                    <div>
                                                        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Cliente
                                                        </h3>
                                                        <div className="space-y-1 text-sm">
                                                            <p className="font-medium">{pagamento.cliente?.nome || 'Visitante'}</p>
                                                            {pagamento.cliente?.email && (
                                                                <p className="text-gray-600">{pagamento.cliente.email}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Seção Pagamento */}
                                                    <div>
                                                        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                            </svg>
                                                            Pagamento
                                                        </h3>
                                                        <div className="space-y-1 text-sm">
                                                            <p>
                                                                <span className="text-gray-600">Método:</span> {pagamento.payment_method?.replace('_', ' ') || 'Não especificado'}
                                                            </p>
                                                            {paymentMethod.brand && (
                                                                <p><span className="text-gray-600">Tipo:</span> Cartão {paymentMethod.brand}</p>
                                                            )}
                                                            {paymentMethod.last4 && (
                                                                <p><span className="text-gray-600">Número:</span> •••• {paymentMethod.last4}</p>
                                                            )}
                                                            {paymentMethod.exp_month && paymentMethod.exp_year && (
                                                                <p><span className="text-gray-600">Vencimento:</span> {paymentMethod.exp_month}/{paymentMethod.exp_year}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Seção Endereço */}
                                                    <div>
                                                        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            Endereço
                                                        </h3>
                                                        {pagamento.enderecoEntrega ? (
                                                            <div className="space-y-1 text-sm">
                                                                <p>{pagamento.enderecoEntrega.rua}, {pagamento.enderecoEntrega.numero}</p>
                                                                <p>{pagamento.enderecoEntrega.bairro}</p>
                                                                <p>{pagamento.enderecoEntrega.cidade} - {pagamento.enderecoEntrega.estado}</p>
                                                                <p>CEP: {pagamento.enderecoEntrega.cep}</p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">Endereço não informado</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Rodapé com detalhes adicionais */}
                                                <div className="p-4 bg-gray-50 border-t">
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-block w-2 h-2 rounded-full ${verification.cvc_check === 'pass' ? 'bg-red-500' : 'bg-green-500'
                                                                }`}></span>
                                                            <span>Verificação CVC: {verification.cvc_check === 'pass' ? 'Falhou' : 'Aprovada'}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-block w-2 h-2 rounded-full ${verification.avs_check === 'pass' ? 'bg-red-500' : 'bg-green-500'
                                                                }`}></span>
                                                            <span>Verificação Endereço: {verification.avs_check === 'pass' ? 'Falhou' : 'Aprovada'}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{new Date(pagamento.created).toLocaleString('pt-BR')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-700">Nenhum pagamento encontrado</h3>
                                    <p className="mt-1 text-gray-500">Não há registros de pagamentos no momento</p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}