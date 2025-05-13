//src/pages/Login.jsx

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

        try {
            const response = await logarUsuario({ email, senha });

            if (response.status === 200 && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                console.log('Token armazenado:', response.data.token);
                navigate('/admin');
            } else {
                console.error("Token não encontrado na resposta");
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
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="min-h-screen flex items-center justify-center bg-[url(../../public/login.png)] bg-cover bg-no-repeat">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

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
