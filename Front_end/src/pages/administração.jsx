

6//Front_end/pages/administração.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { obterAdminData } from '../services/authService';

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

}

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [NomeDoProduto, setNomeDoProduto] = useState("");
    const [PreçoDoProduto, setPreçoDoProduto] = useState("")


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

    if (loading) return <div>Carregando...</div>;
    if (!isAdmin) return <Navigate to="/" />;

    // ... restante do código


    const inputClasses = "w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none";

    const buttonClasses = "flex-1 py-4 px-5 rounded transition-transform duration-300 hover:scale-90";
    const criarProduto = "flex1-1 bg-green-600 text-white hover:bg-green-700"

    return (
        <form onSubmit={handleSubmit} className="mt-20 ml-20 w-full max-w-md space-y-5 bg-white p-10 rounded-4xl shadow-lg">

            <div>
                <h1 className='flex justify-center text-5xl p-10'>Criar produto
                </h1>

                <div>
                    <input

                        type="text"
                        name='Nome do produto'
                        id='Nome do produto'
                        placeholder="Nome do produto"
                        value={NomeDoProduto}
                        onChange={(e) => setNomeDoProduto(e.target.value)}
                        className={inputClasses}

                    />

                    <input type="text"

                        name='preço do produto'
                        id='preço do produto'
                        placeholder='preço do produto'
                        value={PreçoDoProduto}
                        onChange={(e) => setPreçoDoProduto(e.target.value)}
                        className={inputClasses}
                    />


                </div>

                <div className='flex justify-center'>
                    <button

                        type='submit'
                        className={`${buttonClasses} ${criarProduto}`}> criar produto



                    </button>



                </div>
            </div>
        </form>
    );
};

export default Admin;
