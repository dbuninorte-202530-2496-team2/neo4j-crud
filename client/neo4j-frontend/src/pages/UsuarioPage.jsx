import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import UsuarioPosts from "../components/UsuarioPosts";

export default function OtraPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state?.usuario;

  // Copiamos los posts a un estado local para poder modificarlos
  const [posts, setPosts] = useState(usuario?.posts || []);

  const handlePostClick = (usuario, post) => {
    alert(`Post de ${usuario.nombre}: ${post}`);
  };

  const handleAgregarPost = async () => {
    const { value: nuevoPost } = await Swal.fire({
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

    if (nuevoPost) {
      setPosts((prev) => [...prev, nuevoPost]);
      Swal.fire("✅ Post agregado", "", "success");
    }
  };

  if (!usuario) {
    navigate("/usuarios");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <h2 className="text-3xl font-bold mb-6">Posts de {usuario.nombre}</h2>

        {/* Mostrar los posts del usuario */}
        {posts.length > 0 ? (
          <div className="w-full max-w-2xl">
            <UsuarioPosts
              usuario={{ ...usuario, posts }}
              onPostClick={handlePostClick}
            />
          </div>
        ) : (
          <p className="text-white/70 mb-6">
            Este usuario aún no tiene posts
          </p>
        )}

        {/* Botón para agregar un nuevo post */}
        <button
          onClick={handleAgregarPost}
          className="mt-6 rounded-md bg-[#646cff] hover:bg-[#535bf2] px-6 py-2 text-white font-medium transition"
        >
          ➕ Agregar Post
        </button>

      </div>
    </div>
  );
}
