export default function ComentariosList({ comentarios = [],  usuarioActual, onEditar, onEliminar }) {
  if (comentarios.length === 0) {
    return <p className="text-gray-400 italic mb-4">Sin comentarios aún.</p>;
  }

  return (
    <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#2a2a2a] mb-4 pr-2">
      {comentarios.map((com) => {
        const esDelUsuarioActual = usuarioActual && com.usuario?.idu === usuarioActual.idu;

        return (
          <li
            key={`${com.idp}-${com.consec}`}
            className="p-3 bg-[#2a2a2a] rounded-lg text-sm text-gray-300"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">💬</span>
              <div className="flex-1">
                <p className="text-white/90">{com.contenidoCom}</p>

                <span className="block text-xs text-[#646cff]/60 mt-1">
                  {com.usuario?.nombre
                    ? `Por ${com.usuario.nombre}`
                    : "Usuario desconocido"}{" "}
                  · 
                  {com.likeNotLike === true ? (
                    <span className="text-green-500"> 👍 Like</span>
                  ) : (
                    <span className="text-red-500"> 👎 Not Like</span>
                  )}
                  {" "}·{" "}
                  {new Date(com.fechorCom).toLocaleString()}
                </span>

                {com.fechorAut && (
                  <p className="text-[11px] text-green-500 mt-1">
                    ✅ Autorizado el{" "}
                    {new Date(com.fechorAut).toLocaleString()}
                  </p>
                )}

                {/* Botones de editar y eliminar solo si es del usuario actual */}
                {esDelUsuarioActual && (onEditar || onEliminar) && (
                  <div className="flex gap-2 mt-2">
                    {onEditar && (
                      <button
                        onClick={() => onEditar(com)}
                        className="text-xs text-[#646cff] hover:text-[#7b7fff] transition-colors"
                      >
                        ✏️ Editar
                      </button>
                    )}
                    {onEliminar && (
                      <button
                        onClick={() => onEliminar(com)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}