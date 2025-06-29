import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ProductCard from '../Components/ComponentCard';
import { useNavigate } from 'react-router-dom';
import { produtoId, listarProdutos, verificarUsuarioLogado, createCart, addItem,} from '../../src/services/authService';
import '../index.css/index.css'
import carrinhoIMG from '../index.css/assets/carrinho.svg'


export default function PaginaProduto() {
    const navigate = useNavigate();
    const IrLogin = () => navigate("/Login");
    const Home = () => navigate("/");

    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [cart, setCart] = useState(null);

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
            }
            catch (err) {
                if (isMounted) {
                    setErro("erro ao carregar produtos");
                    setProdutos([]);      // <- aqui
                }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
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



    const handleAdicionarAoCarrinho = async () => {
        try {
            await verificarUsuarioLogado(); // Verifica se usuário está logado
            const produtoId = produto._id;
            const quantidade = 1;
            await addItem(produtoId, quantidade);
            alert("Produto adicionado ao carrinho com sucesso!");

        } catch (error) {
            console.error("Erro ao adicionar ao carrinho", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    }





    return (


        <div
            className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] overflow-x-hidden"
            style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
        >



            <div className="grid grid-cols-2 items-center px-10 py-[7px] bg-white mb-8 font-semibold border-b border-gray-300">
                {/* Coluna da esquerda - Título */}
                <h1 className="text-left relative right-8" style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    lineHeight: '21px',
                }}> Lolo_Personalizado</h1>

                {/* Coluna da direita - Campo de busca + botão */}
                <div className="flex justify-end items-center gap-5">
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

                    <button onClick={handleSubmit}
                        className="flex items-center justify-center rounded-full w-[40px] h-[40px] bg-[#F5EDE8] cursor-pointer"
                    >

                    </button>

                    <img onClick={handleSubmit}
                        src={carrinhoIMG} alt="carrinho"
                        className="absolute right-13 cursor-pointer"
                    />

                </div>
            </div>





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
                                    onClick={handleAdicionarAoCarrinho}
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
                        <button onClick={scrollLeft} className="bg-orange-400 hover:bg-orange-500 rounded-full shadow p-3 cursor-pointer z-10">
                            ◀
                        </button>

                        {/* Carrossel */}
                        <div
                            ref={scrollRef}
                            className="overflow-x-auto whitespace-nowrap no-scrollbar snap-x snap-mandatory scroll-smooth mx-1 flex items-center h-[280px]"
                        >
                            <div className="flex gap-4 items-center">
                                {Array.isArray(produtos) ? (
                                    produtos.map((produto) => (
                                        <div
                                            key={produto._id}
                                            className="inline-block w-[200px] min-w-[200px] rounded-lg snap-center"
                                        >
                                            <ProductCard
                                                produto={produto}
                                                onClick={() => navigate(`/produto/${produto._id}`)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Nenhum produto disponível.</p>
                                )}
                            </div>
                        </div>

                        {/* Botão Direita */}
                        <button onClick={scrollRight} className="bg-orange-400 hover:bg-orange-500 rounded-full shadow p-3 cursor-pointer z-10">
                            ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
