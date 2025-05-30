export default function ProductCard({ produto, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      id={`produto-${produto.id}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <img
        src={produto.imagem}
        alt={produto.nome}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-gray-800 font-semibold text-lg truncate">{produto.nome}</h3>
        <p className="text-green-600 font-bold text-xl">R$ {produto.preco.toFixed(2)}</p>
      </div>
    </div>
  );
}
