import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ComponentCard';
import { listarProdutos, BuscarProduto, verificarUsuarioLogado } from '../services/authService';

import busca from '../index.css/assets/busca.svg'
import login from '../index.css/assets/login.png'
import carrinhoIMG from '../index.css/assets/carrinho.svg'


export default function Home() {
    const navigate = useNavigate();
    const IrCadastro = () => navigate("/Cadastrar");
    const IrLogin = () => navigate("/Login");

    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [buscar, setBuscar] = useState("")
    const [query, setQuery] = useState("")

    useEffect(() => {
        let isMounted = true;
        const carregar = async () => {
            setLoading(true);
            try {
                const data = query.trim() === "" ? await listarProdutos() : await BuscarProduto(query);

                if (isMounted) setProdutos(data);

            } catch (err) {
                if (isMounted) {
                    setError("Erro ao carregar produtos");
                    setProdutos([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        carregar();

        return () => {
            isMounted = false;
        };
    }, [query]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await verificarUsuarioLogado();
            navigate('/carrinho');
        } catch (erro) {
            console.error('Usuário não está logado:', erro);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="w-full min-h-screen">
            {}

            <div className="w-full bg-white mb-8 border-b border-gray-300 px-4 sm:px-6 lg:px-10 py-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                    {}
                    <h1 className="text-xl font-semibold text-left"
                        style={{
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                            lineHeight: '21px',
                        }}>
                        Lolo_Personalizado
                    </h1>

                    {}
                    <div className="flex flex-wrap justify-end items-center gap-3">
                        <div className="relative w-[164px] h-[40px]">
                            <input
                                className="w-full h-full pl-8 pr-2 rounded-[6px] text-[12px] bg-[#F5EDE8] text-[#9C784A] font-normal text-center"
                                type="text"
                                placeholder="Search"
                                style={{
                                    fontFamily: "'Be Vietnam Pro', sans-serif",
                                    lineHeight: '21px',
                                }}
                                value={buscar}
                                onChange={e => setBuscar(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setQuery(buscar.trim());
                                    }
                                }}
                            />
                            <img
                                src={busca}
                                alt="busca"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                            />
                        </div>

                        <button
                            onClick={IrLogin}
                            className="rounded-[20px] text-[12px] w-[84px] h-[40px] bg-[#F5EDE8] font-bold text-center cursor-pointer"
                            style={{
                                fontFamily: "'Be Vietnam Pro', sans-serif",
                                lineHeight: '21px',
                            }}
                        >
                            Log in
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="rounded-full w-[40px] h-[40px] bg-[#F5EDE8] flex items-center justify-center cursor-pointer"
                        >
                            <img src={carrinhoIMG} alt="carrinho" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>


 
            {}
            <div className="flex justify-center mb-5 mt-[-10px]">
                <div className="relative rounded-2xl overflow-hidden w-full max-w-[955px] aspect-[928/500]">


                    <img src={login} alt="login"
                        className="w-full h-full object-cover"
                    />

                    {}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]"></div>

                    {}
                    <div className="absolute inset-0 z-30 top-9/12 flex justify-center items-center">
                        <button
                            className="bg-orange-400 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-orange-500 transition cursor-pointer"
                            onClick={IrCadastro}
                        >
                            Get started
                        </button>
                    </div>


                </div>
            </div>


            <div className="container flex w-full max-w-[1500px] px-4 justify-center">
                {loading ? (
                    <div className="text-center py-16 text-lg text-gray-500 animate-pulse">
                        Carregando produtos...
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500 font-medium">
                        {error}
                    </div>
                ) : (




                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center">
                        {Array.isArray(produtos) ? (
                            produtos.map((produto) => (
                                <ProductCard
                                    key={produto._id}
                                    produto={produto}
                                    onClick={() => navigate(`/produto/${produto._id}`)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum produto encontrado.</p>
                        )}
                    </div>





                )}
            </div>
        </div>
    );
}
