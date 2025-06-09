import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../index.css/index.css'

export default function carrinho() {

    const navigate = useNavigate(); 

    const Home = () => navigate("/");


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

                <div className="flex justify-end items-center gap-5">

                    <button
                        onClick={Home}
                        className="flex items-center justify-center rounded-[20px] text-[12px] w-[50px] h-[40px] bg-[#F5EDE8] font-bold text-center cursor-pointer"
                    >eae</button>

                </div>


            </div>
        </div>



    )



}