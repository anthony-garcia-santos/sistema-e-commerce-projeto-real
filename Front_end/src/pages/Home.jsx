import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ComponentCard';
import { listarProdutos } from '../services/authService';

export default function Home() {
    const navigate = useNavigate();
    const IrCadastro = () => navigate("/Cadastrar");
    const IrLogin = () => navigate("/Login");

    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                setLoading(true);
                const response = await listarProdutos();
                setProdutos(response || []);
            } catch (err) {
                console.error('Erro ao carregar produtos:', err);
                setError('Erro ao carregar produtos');
            } finally {
                setLoading(false);
            }
        };
        carregarProdutos();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Header com botões */}
            <div className="flex justify-center py-8 gap-6 bg-white shadow-md mb-8">
                <button
                    onClick={IrCadastro}
                    className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-transform duration-200"
                >
                    Cadastrar-se
                </button>

                <button
                    onClick={IrLogin}
                    className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-transform duration-200"
                >
                    Faça seu login
                </button>
            </div>

            {/* Conteúdo */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {produtos.map(produto => (
                            <ProductCard
                                key={produto._id}
                                produto={produto}
                                onClick={() => navigate(`/produto/${produto._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
