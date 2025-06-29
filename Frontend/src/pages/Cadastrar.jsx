

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authService";

export default function Cadastrar() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const response = await registrarUsuario({ nome, email, senha });
            console.log("Resposta:", response.data);

            alert(response.data.message || "Conta criada com sucesso!");
            navigate("/login");
        } catch (error) {
            console.error("Erro ao registrar:", error);
            alert(error.response?.data?.message || "Erro ao criar conta.");
        } finally {
            setLoading(false);
        }
    };

    return (

        

        <div
            className="relative flex w-full h-screen flex-col bg-[#fcfaf8] overflow-hidden"
            style={{
                fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif'
            }}
        >
            <div className="layout-container flex h-full grow flex-col">

                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4eee7] px-10 py-3">

                    <div className="flex items-center gap-4 text-[#1c150d]">

                        <h2 className="text-[#1c150d] text-lg font-bold leading-tight tracking-[-0.015em]">
                            Lolo_Personalizado</h2>
                    </div>

                </header>


                {}

                <div className="relative flex flex-1 justify-center py-5 px-4 md:justify-start md:px-40 -top-10">

                    <form onSubmit={handleSubmit} className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">

                        <h1 className="text-[#1c150d] tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">

                            Let's get to know you

                        </h1>

                        <p className="text-[#1c150d] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">

                            We will use this information to personalize your experience

                        </p>



                        {}
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

                            <label className="flex flex-col min-w-40 flex-1">

                                <p className="text-[#1c150d] text-base font-medium leading-normal pb-2">

                                    Full name

                                </p>

                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />

                            </label>

                        </div>

                        {}
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

                            <label className="flex flex-col min-w-40 flex-1">

                                <p className="text-[#1c150d] text-base font-medium leading-normal pb-2">

                                    Email

                                </p>

                                <input
                                    type="email"
                                    placeholder="Your email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />

                            </label>
                        </div>

                        {}
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">

                            <label className="flex flex-col min-w-40 flex-1">

                                <p className="text-[#1c150d] text-base font-medium leading-normal pb-2">

                                    Password

                                </p>

                                <input
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c150d] focus:outline-0 focus:ring-0 border-none bg-[#f4eee7] focus:border-none h-14 placeholder:text-[#9c7849] p-4 text-base font-normal leading-normal"
                                />

                            </label>
                        </div>



                        {}
                        <div className="flex px-4 py-3">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#f28f0d] text-[#1c150d] text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate">{loading ? "Creating account..." : "Continue"}</span>
                            </button>
                        </div>

                        {}
                        <div className="flex justify-center px-4 py-3">

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-[#1c150d] text-sm font-medium underline cursor-pointer hover:text-[#f28f0d] "
                            >
                                Already have an account? Login

                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}