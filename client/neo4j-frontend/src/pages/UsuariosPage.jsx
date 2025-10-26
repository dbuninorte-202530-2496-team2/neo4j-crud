import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users =[
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Luis" },
    { id: 3, nombre: "Carlos" },
]

export default function UsuariosPage() {
  const navigate = useNavigate();

  // Array de ejemplo (puedes recibirlo como prop o traerlo de un backend)
  const [usuarios, setUsuarios] = useState(users);

  const [seleccionados, setSeleccionados] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState("");

  const handleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAgregarUsuario = () => {
    if (nuevoUsuario.trim() === "") return;
    const nuevo = { id: Date.now(), nombre: nuevoUsuario };
    setUsuarios((prev) => [...prev, nuevo]);
    setNuevoUsuario("");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>

      <ul className="mb-4">
        {usuarios.map((u) => (
          <li key={u.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={seleccionados.includes(u.id)}
              onChange={() => handleSeleccion(u.id)}
              className="mr-2"
            />
            <span>{u.nombre}</span>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Agregar nuevo usuario:</label>
        <input
          type="text"
          value={nuevoUsuario}
          onChange={(e) => setNuevoUsuario(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2"
        />
        <button
          onClick={handleAgregarUsuario}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Agregar
        </button>
      </div>

      <button
        onClick={() => navigate("/otra")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ir a otra página
      </button>
    </div>
  );
}
