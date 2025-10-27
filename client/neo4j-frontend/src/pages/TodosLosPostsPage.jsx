import Navbar from "../components/Navbar";
import PostItem from "../components/PostItem";
import { useLocation } from "react-router-dom";


export default function TodosLosPostsPage({ users }) {
    const location = useLocation();
    const usuario = location.state?.usuario; // recupera el usuario que viene de Navbar

  // Combinar todos los posts de todos los usuarios en un solo arreglo plano
  const allPosts = users.flatMap((user) =>
    user.posts.map((post) => ({ autor: user.nombre, post }))
  );

  const handlePostClick = (post, autor) => {
    alert(`Post de ${autor}: ${post}`);
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white/87">
      <Navbar usuario = {usuario}/>

      <div className="p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Publicaciones de todos los usuarios</h2>

        <div className="w-full max-w-3xl space-y-4 overflow-y-auto max-h-[70vh] p-4 border border-[#646cff]/30 rounded-lg bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#1a1a1a]">
          {allPosts.map((item, index) => (
            <PostItem
              key={index}
              post={item.post}
              autor={item.autor}
              onClick={handlePostClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
