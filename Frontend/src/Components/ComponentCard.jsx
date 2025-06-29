export default function ProductCard({ produto, onClick }) {
  return (
    <div
      className="rounded-lg  cursor-pointer "
      onClick={onClick}
    >
      {}
      <div className="flex justify-center overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-[176px] h-[176px] object-cover rounded-[12px]"
        />
      </div>

      {}
      <div className="p-4 space-y-1">
        <h3 className="text-[#1C140D] font-medium text-sm truncate text-[16px]"
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            lineHeight: '24px',
          }}
        >
          {produto.nome}</h3>

        <p className="text-[#9C784A] font-normal text-sm"
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            lineHeight: '21px',
          }}> R$ {produto.preco.toFixed(2)}</p>
      </div>
    </div>
  );
}