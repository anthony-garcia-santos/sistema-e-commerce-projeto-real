// src/pages/confirmacao.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Confirmacao() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const pedido = state?.pedido;

  if (!pedido) {
    return <div className="p-6">Pedido não encontrado.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8] p-6">
      <h1 className="text-2xl font-bold text-[#1c140d] mb-4">Pagamento Confirmado</h1>
      <p className="text-[#1c140d] mb-2">Obrigado pelo seu pedido!</p>
      <p className="text-[#1c140d]">Total pago: R$ {pedido.total.toFixed(2)}</p>

      <div className="mt-4 w-full max-w-md p-4 border rounded bg-white">
        <h2 className="font-bold text-[#1c140d] text-lg mb-2">Resumo do Pedido:</h2>
        {pedido.itens.map((item, index) => (
          <div key={index} className="flex justify-between text-sm border-b py-1">
            <span>{item.productId.nome} x{item.quantity}</span>
            <span>R$ {(item.productId.preco * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <p className="text-sm text-[#1c140d] mt-2">ID do Pagamento: {pedido.idPagamento}</p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-[#f38124] text-white rounded hover:bg-[#e5721b]"
      >
        Voltar à Home
      </button>
    </div>
  );
}
