import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioPage from "./pages/UsuarioPage";
import EditUsuarioPage from "./pages/EditUsuarioPage"
import TodosLosPostsPage from "./pages/TodosLosPostsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#242424]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuario" element={<UsuarioPage />} />
          <Route path="/editarUsuario" element={<EditUsuarioPage />} />
          <Route path="/todosLosPosts" element={<TodosLosPostsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}