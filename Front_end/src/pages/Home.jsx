//Front_end/src/pages/Home.jsx

import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const navigate = useNavigate();

    const IrCadastro = () => { navigate("/Cadastrar"); }
    const IrLogin = () => { navigate("/Login"); }


    return (

        <div className="
        w-full flex
        max-w-md
        ml-auto 
        py-5 px-5 
        gap-x-12">


            <button className=" shadow-lg bg-gradient-to-r from-green-600 to-green-400 hover:from-green-400 hover:to-green-600 transition-colors duration-300 ease-in-out text-white rounded-3xl p-2 ml-20"

                onClick={IrCadastro}>Cadastrar-se</button>

            <button className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-400 hover:to-blue-600 transition-colors duration-300 ease-in-out text-white rounded-3xl p-2"

                onClick={IrLogin}>Faça seu login</button>

        </div>

    )
}


