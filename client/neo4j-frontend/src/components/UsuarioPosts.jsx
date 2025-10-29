export default function UsuarioPosts({ usuario, posts, onPostClick, onEditarPost, onEliminarPost }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.idp}
          className="p-4 bg-[#1a1a1a] rounded-lg border border-[#646cff]/30 hover:border-[#646cff]/60 transition-all"
        >
          <div className="flex justify-between items-start gap-3">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onPostClick?.(usuario, post)}
            >
              <p className="text-white/90 mb-2">{post.contenido}</p>
              <p className="text-xs text-[#646cff]/60">
                por {post.autor.nombre}
              </p>
            </div>

            {/* Botones de editar y eliminar */}
            <div className="flex gap-2">
              {onEditarPost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditarPost(post);
                  }}
                  className="px-3 py-1 text-sm bg-[#646cff]/20 hover:bg-[#646cff]/30 text-[#646cff] rounded transition-colors flex items-center gap-1"
                >
                  ✏️ Editar
                </button>
              )}
              
              {onEliminarPost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminarPost(post);
                  }}
                  className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded transition-colors flex items-center gap-1"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}