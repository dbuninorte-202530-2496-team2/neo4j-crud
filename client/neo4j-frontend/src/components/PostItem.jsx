export default function PostItem({ post, usuario, onClick }) {
  return (
    <div
      onClick={() => onClick?.(post, usuario)}
      className="p-3 bg-[#1a1a1a] rounded-md hover:bg-[#323232] cursor-pointer transition"
    >
      <p className="text-white/90">{post.contenido}</p>
      <p className="text-xs text-[#646cff] mt-1">
        {usuario ? `por ${usuario.nombre}` : "Autor desconocido"}
      </p>
    </div>
  );
}
