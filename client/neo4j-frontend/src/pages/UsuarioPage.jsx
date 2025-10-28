import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import UsuarioPosts from "../components/UsuarioPosts";
import PostModal from "../components/PostModal";

export default function UsuarioPage({ posts: allPosts, comentarios: allComentarios }) {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state?.usuario;
  const [postSeleccionado, setPostSeleccionado] = useState(null);

  // Estados locales para posts y comentarios
  const [posts, setPosts] = useState(allPosts);
  const [comentarios, setComentarios] = useState(allComentarios);

  // Si no hay usuario, redirige
  if (!usuario) {
    navigate("/usuarios");
    return null;
  }

  // Filtrar los posts del usuario actual
  const userPosts = posts.filter((p) => p.autor.idu === usuario.idu);

  const handlePostClick = (usuario, post) => {
    setPostSeleccionado(post);
  };

  // 📌 Agregar nuevo post
  const handleAgregarPost = async () => {
    const { value: nuevoContenido } = await Swal.fire({
      title: "Nuevo post",
      input: "textarea",
      inputLabel: "Escribe tu post",
      inputPlaceholder: "Aquí tu texto...",
      inputAttributes: { "aria-label": "Escribe tu post aquí" },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      background: "#1a1a1a",
      color: "#fff",
    });

    if (nuevoContenido) {
      const nuevoPost = {
        idp: posts.length + 1,
        contenido: nuevoContenido,
        autor: { idu: usuario.idu, nombre: usuario.nombre },
      };

      setPosts((prev) => [...prev, nuevoPost]);
      Swal.fire("✅ Post agregado", "", "success");
    }
  };

  // 📌 Agregar comentario
  const handleAgregarComentario = (comentario) => {
    setComentarios((prev) => [...prev, comentario]);
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <h2 className="text-3xl font-bold mb-6">Posts de {usuario.nombre}</h2>

        {/* Mostrar los posts del usuario */}
        {userPosts.length > 0 ? (
          <div className="w-full max-w-2xl">
            <UsuarioPosts usuario={usuario} posts={userPosts} onPostClick={handlePostClick} />
          </div>
        ) : (
          <p className="text-gray-400">Este usuario no tiene posts aún.</p>
        )}

        {/* Botón para agregar post */}
        <button
          onClick={handleAgregarPost}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Agregar Post
        </button>

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
    </div>
  );
}