import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastrar() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cadastro enviado:", { nome, email, senha });
        // Aqui você pode enviar os dados para o servidor.
    };

    const inputClasses = "w-full p-3 rounded border border-gray-300 focus:outline-none";

    const buttonClasses = "flex-1 py-4 px-5 rounded transition-transform duration-300 hover:scale-90";

    const buttonStyles = {
        registro: "bg-green-600 text-white hover:bg-green-700",
        login: "bg-blue-600 text-white hover:bg-blue-700",
        home: "bg-gray-600 text-white hover:bg-gray-700",
    };

    return (
        <div className="min-h-screen p-4 w-full h-screen bg-[url(../../public/logo.png)]  bg-cover bg-no-repeat">

            <form onSubmit={handleSubmit} className="mt-20 ml-20 w-full max-w-md space-y-5 bg-white p-10 rounded-4xl shadow-lg">

                <input
                    type="text"
                    name="nome"
                    id="nome"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={inputClasses}
                />

                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Seu email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}

                />

                {/* senha */}
                <input
                    type="password"
                    name="senha"
                    id="senha"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className={inputClasses}
                />


                {/* botão enviar registro*/}
                <div className="flex justify-between space-x-2">
                    <button
                        type="submit"
                        className={`${buttonClasses} ${buttonStyles.registro}`}
                    >
                        Criar conta

                    </button>


                    {/* botão ir para login*/}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className={`${buttonClasses} ${buttonStyles.login}`}
                    >
                        Fazer login
                    </button>

                    {/* botão ir para home*/}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={`${buttonClasses} ${buttonStyles.home}`}
                    >
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
}
