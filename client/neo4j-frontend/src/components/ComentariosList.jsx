export default function ComentariosList({ comentarios }) {
  if (comentarios.length === 0) {
    return <p className="text-gray-400 italic mb-4">Sin comentarios aún.</p>;
  }

  return (
    <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#2a2a2a] mb-4 pr-2">
      {comentarios.map((com) => (
        <li
          key={com.consec}
          className="p-3 bg-[#2a2a2a] rounded-lg text-sm text-gray-300"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">💬</span>
            <div className="flex-1">
              <p className="text-white/90">{com.contenidoCom}</p>
              <span className="block text-xs text-[#646cff]/60 mt-1">
                {com.likeNotLike} · {new Date(com.fechorCom).toLocaleString()}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}