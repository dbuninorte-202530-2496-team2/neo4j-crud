import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a la HomePage 🏠</h1>


      <button
        onClick={() => navigate("/usuarios")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ir a Usuarios
      </button>
    </div>
  );
}
