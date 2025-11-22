import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostItem from "../components/PostItem";
import PostModal from "../components/PostModal";
import { postsAPI, comentariosAPI } from "../api/api";

export default function TodosLosPostsPage() {
  const location = useLocation();
  const usuario = location.state?.usuario;
  const [postSeleccionado, setPostSeleccionado] = useState(null);

  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [filtro]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      let postsData;
      
      if (filtro === "anonimo") {
        postsData = await postsAPI.getByUsername("ANONIMO");
      } else if (filtro === "manager") {
        postsData = await postsAPI.getByUsername("MANAGER");
      } else {
        postsData = await postsAPI.getAll();
      }

      const comentariosData = await comentariosAPI.getAll();
      
      setPosts(postsData);
      setComentarios(comentariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarComentario = async (comentario) => {
    try {
      const nuevoComentario = await comentariosAPI.create(
        comentario.idp,
        comentario.idu,
        comentario.contenidoCom,
        comentario.likeNotLike 
      );
      setComentarios((prev) => [...prev, nuevoComentario]);
    } catch (error) {
      alert('Error al agregar comentario: ' + error.message);
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleEditarComentario = async (comentarioEditado) => {
    try {
      const comentarioActualizado = await comentariosAPI.update(
        comentarioEditado.idp,
        comentarioEditado.consec,
        comentarioEditado.contenidoCom,
        comentarioEditado.likeNotLike !== undefined ? comentarioEditado.likeNotLike : true
      );
      setComentarios((prev) =>
        prev.map((c) =>
          c.idp === comentarioActualizado.idp && c.consec === comentarioActualizado.consec
            ? comentarioActualizado 
            : c
        )
      );
    } catch (error) {
      alert('Error al editar comentario: ' + error.message);
      console.error('Error al editar comentario:', error);
    }
  };

  const handleEliminarComentario = async (comentario) => {
    try {
      await comentariosAPI.delete(comentario.idp, comentario.consec);
      setComentarios((prev) =>
        prev.filter((c) => !(c.idp === comentario.idp && c.consec === comentario.consec))
      );
    } catch (error) {
      alert('Error al eliminar comentario: ' + error.message);
      console.error('Error al eliminar comentario:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#242424] text-white/87 flex items-center justify-center">
        <div className="text-xl">Cargando posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />

      <div className="p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Publicaciones de todos los usuarios</h2>

        <div className="w-full max-w-3xl mb-4 flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtro === "todos"
                ? "bg-[#646cff] text-white"
                : "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
            }`}
          >
            👥 Usuarios ({filtro === "todos" ? posts.length : "..."})
          </button>

          <button
            onClick={() => setFiltro("anonimo")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtro === "anonimo"
                ? "bg-[#646cff] text-white"
                : "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
            }`}
          >
            🕵️ Anónimo ({filtro === "anonimo" ? posts.length : "..."})
          </button>

          <button
            onClick={() => setFiltro("manager")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtro === "manager"
                ? "bg-[#646cff] text-white"
                : "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
            }`}
          >
            💼 Manager ({filtro === "manager" ? posts.length : "..."})
          </button>
        </div>

        <div className="w-full max-w-3xl space-y-4 overflow-y-auto max-h-[70vh] p-4 border border-[#646cff]/30 rounded-lg bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#1a1a1a]">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post.idp}
                post={post}
                usuario={post.autor}
                onClick={() => setPostSeleccionado(post)}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 py-8">
              No hay posts en esta categoría
            </p>
          )}
        </div>

        <p className="mt-4 text-sm text-white/50">
          Mostrando {posts.length} posts
        </p>
      </div>

      {postSeleccionado && (
        <PostModal
          post={postSeleccionado}
          comentarios={comentarios}
          usuarioActual={usuario}
          onClose={() => setPostSeleccionado(null)}
          onAgregarComentario={handleAgregarComentario}
          onEditarComentario={handleEditarComentario}
          onEliminarComentario={handleEliminarComentario}
        />
      )}
    </div>
  );
}