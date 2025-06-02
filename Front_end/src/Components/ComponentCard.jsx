export default function ProductCard({ produto, onClick }) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer w-[176px]"
      onClick={onClick}
    >
      {/* Imagem com tamanho fixo */}
      <div className="flex justify-center">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-[176px] h-[175px] object-cover rounded-[6px]"
        />
      </div>

      {/* Conteúdo abaixo da imagem */}
      <div className="p-3 space-y-1">
        <h3 className="text-gray-800 font-medium text-sm truncate text-[16px]"
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            lineHeight: '24px',
          }}
        >
          {produto.nome}</h3>

        <p className="text-[#9C784A] font-normal text-sm"
                  style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            lineHeight: '14px',
          }}> R$ {produto.preco.toFixed(2)}</p>
      </div>
    </div>
  );
}