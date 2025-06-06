// Front_end/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logarUsuario } from '../services/authService';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const response = await logarUsuario({ email, senha });

            if (response.status === 200) {
                const { role } = response.data.usuario;
                navigate(role === 'admin' ? '/admin' : '/');
            } else {
                setErro('Verifique suas credenciais e tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            if (error.response) {
                setErro(error.response.data.mensagem || 'Erro no login');
            } else if (error.request) {
                setErro('Erro de conexão com o servidor');
            } else {
                setErro('Ocorreu um erro inesperado');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf8]" style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}>
            <div className="max-w-md mx-auto py-10 px-4">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1c150d] mb-2">Welcome back</h1>
                    <p className="text-[#1c150d]">Sign in to your account</p>
                </header>

                {erro && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-6 text-sm text-center">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[#1c150d] font-medium mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl bg-[#f4eee7] placeholder-[#9c7849] focus:outline-none"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-[#1c150d] font-medium mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Your password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full p-4 rounded-xl bg-[#f4eee7] placeholder-[#9c7849] focus:outline-none"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[#f28f0d] text-[#1c150d] font-bold rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/cadastrar")}
                            className="text-[#1c150d] text-sm underline hover:text-[#f28f0d] cursor-pointer"
                        >
                            Create account
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-[#1c150d] text-sm underline hover:text-[#f28f0d] cursor-pointer "
                        >
                            Back to home
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}