import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obterAdminData, criarProduto, uploadImagem } from '../services/authService';

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

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

    const inputClasses = "w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200";
    const buttonClasses = "py-2 px-6 rounded font-semibold transition-transform duration-300 hover:scale-95";

    return (
        <section className="flex justify-center items-center h-screen overflow-hidden">
            <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-10  gap-5 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
                <h1 className="text-4xl text-center font- mb-10">Criar Produto</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do produto"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        className={inputClasses}
                        required
                    />
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição resumida"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        className={inputClasses}
                    />
                    <input
                        type="text"
                        name="descricaoDetalhada"
                        placeholder="Descrição detalhada"
                        value={form.descricaoDetalhada}
                        onChange={(e) => setForm({ ...form, descricaoDetalhada: e.target.value })}
                        className={inputClasses}
                    />
                    <input
                        type="number"
                        name="preco"
                        placeholder="Preço"
                        value={form.preco}
                        onChange={(e) => setForm({ ...form, preco: e.target.value })}
                        className={inputClasses}
                        step="0.01"
                        required
                    />
                    <input
                        type="text"
                        name="imagem"
                        placeholder="URL da imagem (opcional)"
                        value={form.imagem}
                        onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                        className={inputClasses}
                    />
                </div>

                <div className="space-y-3 mt-2">
                    <label className="block">
                        <span className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded cursor-pointer">
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
                    >
                        Enviar imagem
                    </button>

                    {url && (
                        <div className="text-center mt-4 mb-7">
                            <p className="mb-2 text-gray-700">Imagem enviada para o banco de dados:</p>
                            <img src={url} alt="Preview" className="w-48 mx-auto rounded-lg shadow" />
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={`${buttonClasses} bg-green-600 text-white hover:bg-green-700`}
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Criar Produto'}
                    </button>
                </div>
            </form>
        </section>
    );
}
