import PostItem from "./PostItem";

export default function UsuarioPosts({ usuario, posts, onPostClick }) {
  // Filtrar solo los posts del usuario actual
  const postsDeUsuario = posts.filter(
    (post) => post.autor.idu === usuario.idu
  );

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#1a1a1a]">
      {postsDeUsuario.length > 0 ? (
        postsDeUsuario.map((post) => (
          <PostItem
            key={post.idp}
            post={post}
            usuario = {usuario}
            onClick={() => onPostClick(usuario, post)}
          />
        ))
      ) : (
        <p className="text-white/70 text-center">
          Este usuario no tiene publicaciones aún.
        </p>
      )}
    </div>
  );
}
