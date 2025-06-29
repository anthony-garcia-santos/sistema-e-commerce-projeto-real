
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '/src/services/axios.js';

export default function Pix() {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCode, pedido } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(30 * 60); 

  const verificarPagamento = async () => {
    try {
      const response = await api.get(`/api/payment-status/${pedido.idPagamento}`);
      setStatus(response.data.status);
      if (response.data.status === 'succeeded') {
        navigate('/confirmacao', { state: { pedido } });
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatarTempo = (segundos) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!qrCode || !pedido) return <p>QR Code não encontrado.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8] p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#1c140d]">Pagamento via PIX</h1>
      <img src={`data:image/png;base64,${qrCode}`} alt="QR Code PIX" className="w-64 h-64 border p-2 bg-white" />

      <p className="mt-4 text-[#1c140d]">Escaneie o QR Code acima ou copie o código abaixo:</p>
      <div className="mt-2 p-4 bg-white border rounded-lg w-full max-w-lg">
        <textarea
          readOnly
          className="w-full bg-white text-sm text-[#1c140d] border-none resize-none focus:outline-none"
          value={pedido.idPagamento}
          rows={3}
        />
        <button
          className="mt-2 px-4 py-2 bg-[#f38124] text-white rounded hover:bg-[#e5721b]"
          onClick={() => {
            navigator.clipboard.writeText(pedido.idPagamento);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }}
        >
          {copied ? 'Código Copiado!' : 'Copiar Código' }
        </button>
      </div>

      <p className="mt-4 text-sm text-[#9c6f49]">Tempo restante para pagamento: {formatarTempo(tempoRestante)}</p>
      <button
        onClick={verificarPagamento}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Já paguei, verificar status
      </button>
      {status && <p className="mt-2 text-[#1c140d]">Status atual: {status}</p>}
    </div>
  );
}
