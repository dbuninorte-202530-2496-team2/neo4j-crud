import { useState } from "react";

export default function AgregarPostModal({ isOpen, onClose, onAdd }) {
  const [nuevoPost, setNuevoPost] = useState("");

  if (!isOpen) return null; // No renderiza nada si está cerrado

  const handleSubmit = () => {
    if (nuevoPost.trim() !== "") {
      onAdd(nuevoPost);
      setNuevoPost("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg w-96 text-white">
        <h3 className="text-xl font-semibold mb-4 text-center">Agregar nuevo post</h3>
        <textarea
          value={nuevoPost}
          onChange={(e) => setNuevoPost(e.target.value)}
          placeholder="Escribe tu post aquí..."
          className="w-full p-3 rounded-md bg-[#242424] text-white border border-[#646cff]/40 focus:outline-none focus:border-[#646cff] resize-none h-24"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#646cff] hover:bg-[#535bf2] rounded-md transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
