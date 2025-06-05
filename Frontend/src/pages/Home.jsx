import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ComponentCard';
import { listarProdutos, BuscarProduto } from '../services/authService';

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

    return (
        <div className="w-full min-h-screen">
            {/* Header com botões */}
            <div className="flex justify-end pr-10 py-[7px] gap-5 bg-white mb-8 font-semibold border-b border-gray-300 ">
                <div className="relative w-[164px] h-[40px]">
                    <input
                        className="w-full h-full pl-5 pr-2 rounded-[6px] text-[12px] bg-[#F5EDE8] text-[#9C784A] font-normal text-center"
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
                        src="../busca.svg"
                        alt="ícone de busca"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    />
                </div>

                <button
                    onClick={IrLogin}
                    className="flex items-center justify-center rounded-[20px] text-[12px] w-[84px] h-[40px] bg-[#F5EDE8] font-bold text-center cursor-pointer"
                    style={{
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                        lineHeight: '21px',
                    }}
                >
                    Log in
                </button>
            </div>

            {/* Conteúdo */}
            <div className="flex justify-center mb-5 mt-[-10px]">
                <div className="relative rounded-2xl overflow-hidden w-full max-w-[955px] aspect-[928/500]">
                    <img
                        src="/login.png"
                        alt="imagem"
                        className="w-full h-full object-cover"
                    />

                    {/* Degradê por cima da imagem */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]"></div>

                    {/* Botão centralizado por cima de tudo */}
                    <div className="absolute inset-0 z-30 flex justify-center items-center top-[350px]">
                        <button className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-orange-500 transition cursor-pointer"
                            onClick={IrCadastro}
                        >
                            começar
                        </button>
                    </div>
                </div>
            </div>


            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="text-center py-16 text-lg text-gray-500 animate-pulse">
                        Carregando produtos...
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500 font-medium">
                        {error}
                    </div>
                ) : (
                    <div className="w-full flex justify-center">

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
                            {produtos.map(produto => (
                                <ProductCard
                                    key={produto._id}
                                    produto={produto}
                                    onClick={() => navigate(`/produto/${produto._id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
