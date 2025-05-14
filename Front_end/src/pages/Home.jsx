import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ComponentCard';
import { listarProdutos } from '../services/authService';

export default function Home() {
    const navigate = useNavigate();
    const IrCadastro = () => { navigate("/Cadastrar"); }
    const IrLogin = () => { navigate("/Login"); }

    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                setLoading(true);
                const response = await listarProdutos();
                setProdutos(response || []); // Garante que seja array mesmo se response for undefined
            } catch (err) {
                console.error('Erro ao carregar produtos:', err);
                setError('Erro ao carregar produtos');
                setProdutos([]);
            } finally {
                setLoading(false);
            }
        };
        carregarProdutos();
    }, []);

    return (
        <div className="w-full flex max-w-md ml-auto py-5 px-5 gap-x-12">
            <button 
                className="shadow-lg bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600 transition-colors duration-300 ease-in-out text-white rounded-3xl p-2 ml-20"
                onClick={IrCadastro}
            >
                Cadastrar-se
            </button>

            <button 
                className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-400 hover:to-blue-600 transition-colors duration-300 ease-in-out text-white rounded-3xl p-2"
                onClick={IrLogin}
            >
                Faça seu login
            </button>

            <div className="container mx-auto p-4">
                {loading ? (
                    <p>Carregando produtos...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {produtos.map(produto => (
                            <ProductCard key={produto._id} produto={produto} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}