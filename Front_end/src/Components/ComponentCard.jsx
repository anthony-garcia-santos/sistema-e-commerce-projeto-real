// frontend/src/components/ComponentCard.jsx

export default function ProductCard({ produto }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img 
        src={produto.imagem} 
        alt={produto.nome}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{produto.nome}</h3>
        <p className="text-gray-600">R$ {produto.preco.toFixed(2)}</p>
      </div>
    </div>
  );
}