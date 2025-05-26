import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { produtoId } from '../services/authService';

export default function PaginaProduto() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregar = async () => {
            try {
                setLoading(true);
                const data = await produtoId(id);
                setProduto(data);
            } catch (err) {
                setErro('Produto não encontrado');
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (erro) return <p className="text-red-500">{erro}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{produto.nome}</h1>
            <img src={produto.imagem} alt={produto.nome} className="w-full max-w-md" />
            <p className="mt-2 text-xl text-amber-600">
                R$ {produto.preco.toFixed(2)}
            </p>
            <p className="mt-4">{produto.descricao}</p>
        </div>
    );
}
