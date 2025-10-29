import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioPage from "./pages/UsuarioPage";
import  EditUsuarioPage from "./pages/EditUsuarioPage"
import TodosLosPostsPage from "./pages/TodosLosPostsPage";

// USUARIOS
const usuarios = [
  { idu: 1, nombre: "Ana" },
  { idu: 2, nombre: "Manager" },
  { idu: 3, nombre: "Anonimo" },
];

const posts = [
  {idp: 1, contenido: "Hoy aprendí cómo usar useState en React 😄", autor: { idu: 1, nombre: "Ana" }},
  {idp: 2, contenido: "Estoy experimentando con MongoDB y me encanta 🚀", autor: { idu: 2, nombre: "Manager" }},
  {idp: 3, contenido: "Alguien más usa Neo4j? Es genial para datos relacionados 😍", autor: { idu: 3, nombre: "Anonimo" }},
  {idp: 4, contenido: "Hoy terminé mi primer CRUD completo con React y Node 💪", autor: { idu: 1, nombre: "Ana" }},
  {idp: 5, contenido: "Hoy terminé mi primer CRUD completo con React y Node 💪", autor: { idu: 2, nombre: "Manager" }},
  {idp: 6, contenido: "Hoy terminé mi primer CRUD completo con React y Node 💪", autor: { idu: 3, nombre: "Anonimo" }},
];

// COMENTARIOS
const comentarios = [
  {
    consec: 1,
    contenidoCom: "Excelente post Ana!",
    fechorCom: "2025-10-27T10:30:00",
    likeNotLike: "like",
    fechorAut: "",
    idp: 1, // pertenece al post con idp=1
    idu: 2, // hecho por el usuario con idu=2 (Luis)
  },
  {
    consec: 2,
    contenidoCom: "Muy interesante 😃",
    fechorCom: "2025-10-27T11:00:00",
    likeNotLike: "like",
    fechorAut: "2025-10-27T11:05:00",
    idp: 1,
    idu: 3, // hecho por Carlos
  },
  {
    consec: 3,
    contenidoCom: "Buen ejemplo 👏",
    fechorCom: "2025-10-27T12:00:00",
    likeNotLike: "like",
    fechorAut: "2025-10-27T12:10:00",
    idp: 3,
    idu: 1, // hecho por Ana
  },
];


export default function App() {
  return (
    <div className="min-h-screen bg-[#242424] ">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/usuarios" element={<UsuariosPage users={usuarios} />} />
        <Route path="/usuario" element={<UsuarioPage posts={posts} comentarios={comentarios} usuarios={usuarios}/>} />
        <Route path= "/editarUsuario" element={<EditUsuarioPage/>}/>
        <Route path= "/todosLosPosts" element={<TodosLosPostsPage posts = {posts} comentarios = {comentarios} usuarios={usuarios}/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}
