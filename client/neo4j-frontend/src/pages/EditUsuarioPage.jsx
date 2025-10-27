import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function EditUsuarioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state?.usuario;

  // Estado local editable
  const [nombre, setNombre] = useState(usuario?.nombre || "");

  if (!usuario) {
    // Si no hay usuario, volvemos a la lista
    navigate("/usuarios");
    return null;
  }

  const handleEditar = () => {

    alert(`Usuario "${usuario.nombre}" cambiado a "${nombre}"`);
    // Luego volvemos a la lista
    navigate("/usuario", { state: { usuario: usuario } });
  };

  const handleEliminar = () => {
    alert(`Usuario "${usuario.nombre}" eliminado`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>

        <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
          <label className="block text-white/70 mb-2 text-sm">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-[#242424] text-white/87 border border-[#646cff]/30 focus:border-[#646cff] focus:outline-none"
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={handleEditar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Guardar
            </button>
            <button
              onClick={handleEliminar}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Eliminar
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-md border border-[#646cff]/50 px-4 py-2 hover:bg-[#646cff]/10 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
