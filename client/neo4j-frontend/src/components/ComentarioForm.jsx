import { useState } from "react";

export default function ComentarioForm({ onAgregar, usuarioActual }) {
  const [nuevoComentario, setNuevoComentario] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (nuevoComentario.trim() === "") return;

    onAgregar(nuevoComentario);
    setNuevoComentario("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#646cff]/30 pt-4">
      <label className="block mb-2 text-sm font-medium text-white/70">
        Agregar comentario como <span className="text-[#646cff]">{usuarioActual.nombre}</span>:
      </label>
      <textarea
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows="3"
        className="w-full rounded-lg border border-transparent bg-[#2a2a2a] text-white/87 px-4 py-2 text-sm resize-none focus:outline-none focus:border-[#646cff] placeholder:text-white/40 transition-[border-color] duration-[250ms]"
      />
      <button
        type="submit"
        disabled={nuevoComentario.trim() === ""}
        className="mt-2 px-4 py-2 bg-[#646cff] hover:bg-[#7b7fff] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Comentar
      </button>
    </form>
  );
}