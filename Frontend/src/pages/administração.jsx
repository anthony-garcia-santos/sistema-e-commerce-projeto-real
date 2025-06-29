import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obterAdminData, criarProduto, uploadImagem, Pedidos } from '../services/authService';

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pedidos, setPedidos] = useState([]);

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
        const fetchPedidos = async () => {
            try {
                const data = await Pedidos();
                setPedidos(data);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };

        fetchPedidos();
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
        <div className="relative flex w-full h-screen flex-col bg-[#fcfaf8]"
            style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}>

            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4eee7] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c150d]">
                        <h2 className="text-[#1c150d] text-lg font-bold leading-tight tracking-[-0.015em]">
                            Lolo_Personalizado
                        </h2>
                    </div>
                </header>



                <div className="relative -top-16 px-40 flex flex-1 justify-center py-5">

                    <form onSubmit={handleSubmit} className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">

                        <h1 className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
                            Criar Novo Produto
                        </h1>

                        <p className="text-[#1c150d] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                            Preencha os detalhes do produto abaixo
                        </p>





                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[960px] mx-auto px-4">
                            <div>
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Nome do Produto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nome do produto"
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Descrição Resumida
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descrição resumida"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div>
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Descrição Detalhada
                                </label>
                                <textarea
                                    placeholder="Descrição detalhada"
                                    value={form.descricaoDetalhada}
                                    onChange={(e) => setForm({ ...form, descricaoDetalhada: e.target.value })}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none min-h-[100px] placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div>
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    Preço
                                </label>
                                <input
                                    type="number"
                                    placeholder="Preço"
                                    value={form.preco}
                                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[#1c150d] text-base font-medium leading-normal pb-2 block">
                                    URL da Imagem (opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="URL da imagem"
                                    value={form.imagem}
                                    onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />
                            </div>

                            <div className="space-y-3">
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

                                {url && (
                                    <div className="text-center mt-4">
                                        <p className="mb-2 text-[#1c150d]">Imagem enviada:</p>
                                        <img src={url} alt="Preview" className="w-48 mx-auto rounded-lg shadow" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="flex px-4 py-3 justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#f28f0d] text-[#1c150d] text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate">{loading ? "Enviando..." : "Criar Produto"}</span>
                            </button>
                        </div>


                        <h2 className="text-xl font-bold">Pedidos Recentes</h2>

                        <ul>
                            {pedidos.map((pedido) => (
                                <li key={pedido._id} className="border p-4 my-2 rounded">
                                    <p><strong>Usuário:</strong> {pedido.userId || 'Visitante'}</p>
                                    <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
                                    <p><strong>Itens:</strong></p>
                                    <ul className="ml-4">
                                        {pedido.itens.map((item, idx) => (
                                            <li key={idx}>{item.nome} x{item.quantidade}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>

                    </form>
                </div>
            </div>
        </div>
    );
}