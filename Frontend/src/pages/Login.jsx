import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logarUsuario } from '../services/authService';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");

        // Lógica para lidar com o código 429 (Too Many Requests)
        setTimeout(async () => {
            try {
                const response = await logarUsuario({ email, senha });

                if (response.status === 200) {
                    console.log('Login bem-sucedido');

                    const { role } = response.data.usuario;

                    // Redireciona com base na role
                    if (role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/'); // ou qualquer outra rota de usuários comuns
                    }

                } else {
                    setErro('Erro ao processar login. Verifique suas credenciais.');
                }

            } catch (error) {
                console.error('Erro ao fazer login:', error);

                if (error.response) {
                    setErro(error.response.data.mensagem || 'Erro no login');
                } else if (error.request) {
                    setErro('Erro de rede. O servidor não respondeu.');
                } else {
                    setErro('Erro desconhecido: ' + error.message);
                }
            }
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="min-h-screen flex items-center justify-center bg-[url(../../public/login.png)] bg-cover bg-no-repeat">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                    {erro && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
                            {erro}
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-2 p-3 border rounded-lg focus:outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full mb-6 p-3 border rounded-lg focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700"
                    >
                        Entrar
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="bg-gray-600 text-white w-full p-3 rounded-lg hover:bg-gray-700 mt-4"
                    >
                        Início
                    </button>
                </div>
            </div>
        </form>
    );
}
