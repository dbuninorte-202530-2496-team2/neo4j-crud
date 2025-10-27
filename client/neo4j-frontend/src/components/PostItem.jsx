export default function PostItem({ post, autor, onClick }) {
  return (
    <div
      onClick={() => onClick?.(post, autor)}
      className="p-3 bg-[#1a1a1a] rounded-md hover:bg-[#323232] cursor-pointer transition"
    >
      <p className="text-white/90">{post}</p>
      <p className="text-xs text-[#646cff] mt-1">por {autor}</p>
    </div>
  );
}
