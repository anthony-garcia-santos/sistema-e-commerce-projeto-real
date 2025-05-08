//Front_end/src/pages/Login.jsx


import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("bem vindo:", { email, senha });

        // Aqui você pode enviar os dados para o servidor com fetch ou axios
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="min-h-screen flex items-center justify-center bg-[url(../../public/login.png)] bg-cover bg-no-repeat">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
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
                        className="bg-gray-600 text-white w-full p-3 rounded-lg hover:bg-gray-700 mt-4"
                        onClick={() => navigate("/")}
                    >
                        Início
                    </button>
                </div>
            </div>
        </form>
    );
}
