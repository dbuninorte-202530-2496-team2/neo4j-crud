import { format } from "date-fns";

export default function AutorizarComentarios({ usuario, comentarios, posts, onAutorizar }) {
  // Filtrar solo los comentarios que pertenecen a posts del usuario actual
  // y que aún no están autorizados
  const comentariosPendientes = comentarios.filter((c) => {
    const postDelUsuario = posts.find((p) => p.idp === c.idp && p.autor.idu === usuario.idu);
    return postDelUsuario && (!c.fechorAut || c.fechorAut === "");
  });

  if (comentariosPendientes.length === 0) {
    return (
      <div className="mt-10 text-gray-400 text-center">
        No hay comentarios pendientes de autorización.
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-2xl bg-[#1a1a1a] rounded-lg p-4 border border-[#646cff]/30">
      <h3 className="text-2xl font-semibold mb-4 text-center text-[#646cff]">
        Comentarios pendientes
      </h3>

      <ul className="space-y-4">
        {comentariosPendientes.map((c) => (
          <li key={c.consec} className="bg-[#242424] p-3 rounded-md shadow">
            <p className="text-white/90 mb-2">{c.contenidoCom}</p>
            <p className="text-sm text-gray-400">
              En el post:{" "}
              <span className="text-[#646cff]">
                {posts.find((p) => p.idp === c.idp)?.contenido || "Desconocido"}
              </span>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Comentado el {format(new Date(c.fechorCom), "yyyy-MM-dd HH:mm")}
            </p>

            <button
              onClick={() => onAutorizar(c)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1 rounded-md transition"
            >
              Autorizar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
