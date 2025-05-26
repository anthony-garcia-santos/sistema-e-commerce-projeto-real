// frontend/src/components/ComponentCard.jsx
//         <h3 className="font-bold text-lg">{produto.nome}</h3>

export default function ProductCard({ produto, onClick }) {







  return (
    <div
      className="rounded-lg overflow-hidden shadow-2xl 
      transition-transform duration-200 hover:scale-105 
      active:scale-95 cursor-pointer"
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
      <div className="p-4">
        <p className="font-bold text-amber-600">R$ {produto.preco.toFixed(2)}</p>
      </div>
    </div>
  );
}