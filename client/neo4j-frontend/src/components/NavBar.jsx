import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";

export default function Navbar({ usuario }) {
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="px-6 py-3 flex justify-between items-center">
        {/* Logo o título */}
        <h1 className="text-xl font-semibold tracking-wide">Neo4j CRUD</h1>

        {/* Botones de navegación */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
          >
            Inicio
          </button>
          <button
            onClick={() => navigate("/todosLosPosts", { state: { usuario } })}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
          >
            Posts
          </button>
          <button
              onClick={() => navigate("/usuario", { state: { usuario } })}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
            >
              Mis Posts
            </button>
          <button
              onClick={() => navigate("/editarUsuario", { state: { usuario } })}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
            >
              Acerca de Usuario
            </button>
        </div>
      </div>
    </nav>
  );
}
