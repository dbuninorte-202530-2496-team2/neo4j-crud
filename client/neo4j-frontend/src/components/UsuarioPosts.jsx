import PostItem from "./PostItem";

export default function UsuarioPosts({ usuario }) {
  if (!usuario) return null;

  const handlePostClick = (post, autor) => {
    alert(`Post de ${autor}: ${post}`);
  };

  return (
    <div className="bg-[#2a2a2a] p-4 rounded-lg w-full">
      <h3 className="text-xl font-semibold text-[#646cff] mb-3">
        {usuario.nombre}
      </h3>

      <div className="space-y-3 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-[#646cff]/50 scrollbar-track-[#1a1a1a]">
        {usuario.posts.map((post, index) => (
          <PostItem
            key={index}
            post={post}
            autor={usuario.nombre}
            onClick={handlePostClick}
          />
        ))}
      </div>
    </div>
  );
}
