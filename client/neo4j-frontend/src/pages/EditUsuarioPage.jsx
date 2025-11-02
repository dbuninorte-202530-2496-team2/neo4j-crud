import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { usuariosAPI } from "../api/api";

export default function EditUsuarioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = location.state?.usuario;

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [loading, setLoading] = useState(false);

  if (!usuario) {
    navigate("/usuarios");
    return null;
  }

  const handleEditar = async () => {
    if (!nombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    try {
      setLoading(true);
      const usuarioActualizado = await usuariosAPI.update(usuario.idu, nombre);
      alert(`Usuario "${usuario.nombre}" cambiado a "${nombre}"`);
      navigate("/usuario", { state: { usuario: usuarioActualizado } });
    } catch (error) {
      alert('Error al actualizar usuario: ' + error.message);
      console.error('Error al actualizar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm(`¿Estás seguro de eliminar el usuario "${usuario.nombre}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await usuariosAPI.delete(usuario.idu);
      alert(`Usuario "${usuario.nombre}" eliminado`);
      navigate("/");
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.message);
      console.error('Error al eliminar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario={usuario} />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>

        <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
          <label className="block text-white/70 mb-2 text-sm">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 rounded-md bg-[#242424] text-white/87 border border-[#646cff]/30 focus:border-[#646cff] focus:outline-none disabled:opacity-50"
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={handleEditar}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleEliminar}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="mt-6 w-full rounded-md border border-[#646cff]/50 px-4 py-2 hover:bg-[#646cff]/10 transition disabled:opacity-50"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}