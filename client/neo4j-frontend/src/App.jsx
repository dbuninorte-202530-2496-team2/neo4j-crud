import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioPage from "./pages/UsuarioPage";
import  EditUsuarioPage from "./pages/EditUsuarioPage"
import TodosLosPostsPage from "./pages/TodosLosPostsPage";

const defaultUsers =[
    { id: 1, nombre: "Ana" , posts: [{id: 1, contenido: "Lorem ipsum1", comentarios:[]}, "Lorem ipsum2", "Lorem ipsum3", "Lorem ipsum4","Lorem ipsum5", "Lorem ipsum6"]},
    { id: 2, nombre: "Luis" , posts: ["Lorem ipsum1", "Lorem ipsum2", "Lorem ipsum3", "Lorem ipsum4","Lorem ipsum5", "Lorem ipsum6"] },
    { id: 3, nombre: "Carlos" , posts: ["Lorem ipsum1", "Lorem ipsum2", "Lorem ipsum3", "Lorem ipsum4","Lorem ipsum5", "Lorem ipsum6"]},
]

export default function App() {
  return (
    <div className="min-h-screen bg-[#242424] ">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/usuarios" element={<UsuariosPage users={defaultUsers} />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path= "/editarUsuario" element={<EditUsuarioPage/>}/>
        <Route path= "/todosLosPosts" element={<TodosLosPostsPage users={defaultUsers}/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}
