import { useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import PostItem from "../components/PostItem";
import PostModal from "../components/PostModal";

export default function TodosLosPostsPage({ posts: allPosts, comentarios: allComentarios }) {
  const location = useLocation();
  const usuario = location.state?.usuario;
  const [postSeleccionado, setPostSeleccionado] = useState(null);

  // Estados locales para posts y comentarios
  const [posts, setPosts] = useState(allPosts);
  const [comentarios, setComentarios] = useState(allComentarios);

  // 📌 Agregar comentario
  const handleAgregarComentario = (comentario) => {
    setComentarios((prev) => [...prev, comentario]);
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />

      <div className="p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Publicaciones de todos los usuarios</h2>

        <div className="w-full max-w-3xl space-y-4 overflow-y-auto max-h-[70vh] p-4 border border-[#646cff]/30 rounded-lg bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#1a1a1a]">
          {posts.map((post) => (
            <PostItem
              key={post.idp}
              post={post}
              usuario={post.autor}
              onClick={() => setPostSeleccionado(post)}
            />
          ))}
        </div>
      </div>

      {/* Modal que se muestra al hacer click */}
      {postSeleccionado && (
        <PostModal
          post={postSeleccionado}
          comentarios={comentarios}
          usuarioActual={usuario}
          onClose={() => setPostSeleccionado(null)}
          onAgregarComentario={handleAgregarComentario}
        />
      )}
    </div>
  );
}