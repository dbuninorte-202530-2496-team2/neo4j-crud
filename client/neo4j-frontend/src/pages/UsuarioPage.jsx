import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UsuarioPosts from "../components/UsuarioPosts";
import PostModal from "../components/PostModal";
import AutorizarComentarios from "../components/AutorizarComentarios";
import { postsAPI, comentariosAPI } from "../api/api";

export default function UsuarioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state?.usuario;
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) {
      navigate("/usuarios");
      return;
    }
    cargarDatos();
  }, [usuario, navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [postsData, comentariosData] = await Promise.all([
        postsAPI.getByIdu(usuario.idu),
        comentariosAPI.getAll()
      ]);
      setPosts(postsData);
      setComentarios(comentariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null;

  const handlePostClick = (usuario, post) => {
    setPostSeleccionado(post);
  };

 const handleAgregarPost = async () => {
    const nuevoContenido = prompt("Escribe tu post:");

    if (nuevoContenido && nuevoContenido.trim()) {
      try {
        const nuevoPost = await postsAPI.create(nuevoContenido, usuario.idu);
        setPosts((prev) => [nuevoPost, ...prev]); // Lo agrega al inicio
        alert("✅ Post agregado correctamente");
      } catch (error) {
        alert("❌ Error al crear post: " + error.message);
        console.error("Error al crear post:", error);
      }
    }
  };


  const handleEditarPost = async (post) => {
    const nuevoContenido = prompt("Editar post:", post.contenido);

    if (nuevoContenido && nuevoContenido.trim() !== "") {
      try {
        const postEditado = await postsAPI.update(post.idp, nuevoContenido);
        setPosts((prev) =>
          prev.map((p) => (p.idp === postEditado.idp ? postEditado : p))
        );
      } catch (error) {
        alert('Error al editar post: ' + error.message);
        console.error('Error al editar post:', error);
      }
    }
  };

  const handleEliminarPost = async (post) => {
    if (confirm("¿Eliminar post? Esta acción eliminará el post y todos sus comentarios")) {
      try {
        await postsAPI.delete(post.idp);
        setPosts((prev) => prev.filter((p) => p.idp !== post.idp));
        setComentarios((prev) => prev.filter((c) => c.idp !== post.idp));
      } catch (error) {
        alert('Error al eliminar post: ' + error.message);
        console.error('Error al eliminar post:', error);
      }
    }
  };

  const handleAgregarComentario = async (comentario) => {
    try {
      const nuevoComentario = await comentariosAPI.create(
        comentario.idp,
        comentario.idu,
        comentario.contenidoCom,
        comentario.likeNotLike || true
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

  const handleAutorizarComentario = async (comentario) => {
    try {
      await comentariosAPI.authorize(comentario.idp, comentario.consec, usuario.idu);
      setComentarios((prev) =>
        prev.map((c) =>
          c.idp === comentario.idp && c.consec === comentario.consec
            ? { ...c, fechorAut: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      alert('Error al autorizar comentario: ' + error.message);
      console.error('Error al autorizar comentario:', error);
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
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <h2 className="text-3xl font-bold mb-6">Posts de {usuario.nombre}</h2>

        {posts.length > 0 ? (
          <div className="w-full max-w-2xl">
            <UsuarioPosts 
              usuario={usuario} 
              posts={posts} 
              onPostClick={handlePostClick}
              onEditarPost={handleEditarPost}
              onEliminarPost={handleEliminarPost}
            />
          </div>
        ) : (
          <p className="text-gray-400">Este usuario no tiene posts aún.</p>
        )}

        <AutorizarComentarios
          usuario={usuario}
          comentarios={comentarios}
          posts={posts}
          onAutorizar={handleAutorizarComentario}
        />

        <button
          onClick={handleAgregarPost}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Agregar Post
        </button>

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
    </div>
  );
}