import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { produtoId } from '../services/authService';

export default function PaginaProduto() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [quantidade, setQuantidade] = useState(1);

    useEffect(() => {
        const carregar = async () => {
            try {
                setLoading(true);
                const data = await produtoId(id);

                // Força preco a ser número
                data.preco = parseFloat(data.preco);

                setProduto(data);
            } catch (err) {
                setErro('Produto não encontrado');
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [id]);

    const aumentar = () => setQuantidade((prev) => prev + 1);
    const diminuir = () => setQuantidade((prev) => (prev > 1 ? prev - 1 : 1));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg animate-pulse">Carregando...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-lg">{erro}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden p-8 md:p-12 flex flex-col md:flex-row gap-10">

                <div className="md:w-1/2 flex justify-center items-center">
                    <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]"
                    />
                </div>

                <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{produto.nome}</h1>
                        <p className="text-lg text-gray-600 mb-6">{produto.descricao}</p>

                        <p className="text-3xl text-green-600 font-semibold mb-4">
                            R$ {produto.preco.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={diminuir}
                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold transition"
                            >
                                −
                            </button>
                            <span className="text-xl font-semibold w-8 text-center">{quantidade}</span>
                            <button
                                onClick={aumentar}
                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold transition"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-lg text-gray-800">
                            Total:{' '}
                            <span className="font-bold text-green-700">
                                R$ {(produto.preco * quantidade).toFixed(2)}
                            </span>
                        </p>
                    </div>

                    <div className="mt-10">
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform hover:scale-95 text-lg font-medium">
                            Adicionar ao carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
