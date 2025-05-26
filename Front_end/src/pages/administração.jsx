import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obterAdminData, criarProduto } from '../services/authService';

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
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
                preco: parseFloat(form.preco)
            });
            alert('Produto cadastrado com sucesso!');
            setForm({
                nome: '',
                descricao: '',
                preco: '',
                imagem: '',
            });
        } catch (error) {
            alert('Erro ao cadastrar produto');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verificarAdmin = async () => {
            try {
                await obterAdminData();
                setIsAdmin(true);
            } catch (error) {
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
            <div>
                <h1 className='flex justify-center text-5xl p-10'>Criar produto</h1>
                <div>
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
                        placeholder='URL da imagem'
                        value={form.imagem}
                        onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                        className={inputClasses}
                    />
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
            </div>
        </form>
    );
}