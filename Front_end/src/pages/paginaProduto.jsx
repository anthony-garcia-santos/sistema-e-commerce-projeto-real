import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { produtoId } from '../services/authService';
import ProductCard from '../Components/ComponentCard';
import { useNavigate } from 'react-router-dom';
import { listarProdutos, BuscarProduto } from '../services/authService';
import '../index.css/index.css'


export default function PaginaProduto() {
    const navigate = useNavigate();
    const IrCadastro = () => navigate("/Cadastrar");
    const IrLogin = () => navigate("/Login");
    const Home = () => navigate("/");

    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // ---------- Primeira lógica de carregamento (já existia) ----------
    useEffect(() => {
        let isMounted = true;

        const carregar = async () => {
            try {
                setLoading(true);
                const data = await produtoId(id);
                data.preco = parseFloat(data.preco);
                setProduto(data);

                const lista = await listarProdutos();
                if (isMounted) setProdutos(lista);
            } catch (err) {
                if (isMounted) { setErro("erro ao carregar produtos"); }
                setProdutoLista([]);
                setErro('Produto não encontrado');
            } finally {
                setLoading(false);
            }
        };

        carregar();
        return () => {
            isMounted = false;
        };
    }, [id]);

    
    // ------------------------------------------------------------------

    // Referência ao container do carrossel
    const scrollRef = useRef(null);

    // Funções para rolar com os botões de seta
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' });
    };
    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    };

    // Segundo useEffect: converte scroll vertical em horizontal
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, []);

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
        <div
            className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] overflow-x-hidden"
            style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
        >
            {/* Home/Produto */}
            <div className="relative left-40 top-6 p-4 px-10">
                <button
                    onClick={Home}
                    className="text-[#9c7849] text-base font-medium leading-normal cursor-pointer"
                >
                    Home
                </button>
                <span className="text-[#9c7849] text-base font-medium leading-normal">/</span>
                <span className="text-[#1c150d] text-base font-medium leading-normal">Produto</span>
            </div>

            {/* Área Principal */}
            <div className="px-10 flex justify-center py-5">
                <div className="flex flex-col max-w-[960px] flex-1 w-full">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Imagem do Produto */}
                            <div className="w-full md:w-[464px]">
                                <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    className="w-[464px] h-[256px] object-cover rounded-xl"
                                />
                            </div>

                            {/* Detalhes do Produto */}
                            <div className="flex flex-col justify-center gap-4 w-full">
                                <p className="text-[#9c7849] text-sm font-light">
                                    R$ {produto.preco.toFixed(2)}
                                </p>
                                <p className="text-[#1c150d] text-xl font-bold">
                                    {produto.nome}
                                </p>
                                <p className="text-[#9c7849] text-sm font-light">
                                    {produto.descricao}
                                </p>
                                <button
                                    className="h-12 w-fit px-6 rounded-full bg-[#f28f0d] text-[#1c150d] text-sm font-medium cursor-pointer"
                                >
                                    Adicionar ao carrinho
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Detalhes do Produto */}
                    <div className="px-4">
                        <h2 className="text-[#1c150d] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                            Detalhes do Produto
                        </h2>
                        <p className="text-[#1c150d] text-base font-normal leading-normal pb-3 pt-1">
                            {produto.descricaoDetalhada}
                        </p>
                    </div>




                    {/* Carrossel de Produtos Similares */}
                    <div className="flex items-center px-4 py-6 relative">
                        {/* Botão Esquerda */}
                        <button
                            onClick={scrollLeft}
                            className="bg-orange-400 hover:bg-orange-500 rounded-full shadow p-3 cursor-pointer z-10"
                        >
                            ◀
                        </button>

                        {/* Carrossel */}
                        <div
                            ref={scrollRef}
                            className="overflow-x-auto whitespace-nowrap no-scrollbar snap-x snap-mandatory scroll-smooth mx-1 flex items-center h-[280px]"
                        >
                            <div className="flex gap-4 items-center">
                                {produtos.map((produto) => (
                                    <div
                                        key={produto._id}
                                        className="inline-block w-[200px] min-w-[200px] rounded-lg snap-center"
                                    >
                                        <ProductCard
                                            produto={produto}
                                            onClick={() => navigate(`/produto/${produto._id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botão Direita */}
                        <button
                            onClick={scrollRight}
                            className="bg-orange-400 hover:bg-orange-500 rounded-full shadow p-3 cursor-pointer z-10"
                        >
                            ▶
                        </button>
                    </div>





                </div>
            </div>
        </div>
    );
}
