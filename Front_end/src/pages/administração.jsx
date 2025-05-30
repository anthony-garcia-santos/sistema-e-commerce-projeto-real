import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obterAdminData, criarProduto } from '../services/authService';
import { uploadImagem } from '../services/authService'; // Importação que faltava

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [imagem, setImagem] = useState(null); // Estado para imagem do tipo File
    const [url, setUrl] = useState(""); // Estado para a URL da imagem enviada

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        imagem: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await criarProduto({
                ...form,
                preco: parseFloat(form.preco),
                imagem: url || form.imagem, // Usa a URL da imagem enviada ou a digitada manualmente
            });
            alert('Produto cadastrado com sucesso!');
            setForm({
                nome: '',
                descricao: '',
                preco: '',
                imagem: '',
            });
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
        if (!imagem) {
            6
            return alert("Selecione uma imagem primeiro.");
        }

        try {
            const resposta = await uploadImagem(imagem);
            setUrl(resposta.url);
            alert("Upload feito com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            alert("Falha no upload");
        }
    };

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

    if (loading) return <div className='flex justify-center'>Carregando...</div>;
    if (!isAdmin) return <Navigate to="/" />;

    const inputClasses = "w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none";
    const buttonClasses = "flex-1 py-4 px-5 rounded transition-transform duration-300 hover:scale-90";

    return (
        <form onSubmit={handleSubmit} className="mt-20 ml-20 w-full max-w-md space-y-5 bg-white p-10 rounded-4xl shadow-lg">
            <h1 className='flex justify-center text-5xl p-10'>Criar produto</h1>

            <input
                type="text"
                name='nome'
                placeholder="Nome do produto"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className={inputClasses}
                required
            />

            <input
                type="text"
                name='descricao'
                placeholder='Descrição do produto'
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className={inputClasses}
            />

            <input
                type="number"
                name='preco'
                placeholder='Preço do produto'
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
                className={inputClasses}
                required
                step="0.01"
            />

            <input
                type="text"
                name='imagem'
                placeholder='URL da imagem (opcional)'
                value={form.imagem}
                onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                className={inputClasses}
            />

            <div className="p-4">
                <div className="mb-4">
                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
                        Selecionar imagem
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagem(e.target.files[0])}
                            className="hidden"
                        />
                    </label>
                </div>
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
                >
                    Enviar imagem
                </button>

                {url && (
                    <div className="mt-4">
                        <p>Imagem enviada:</p>
                        <img src={url} alt="Preview" className="w-48 border" />
                    </div>
                )}
            </div>

            <div className='flex justify-center'>
                <button
                    type='submit'
                    className={`${buttonClasses} bg-green-600 text-white hover:bg-green-700`}
                    disabled={loading}
                >
                    {loading ? 'Enviando...' : 'Criar produto'}
                </button>
            </div>
        </form>
    );
}
