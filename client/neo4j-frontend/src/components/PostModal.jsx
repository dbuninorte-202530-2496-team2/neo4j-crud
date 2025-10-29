import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import ComentarioForm from "./ComentarioForm";
import ComentariosList from "./ComentariosList";
import { mostrarModalEditarComentario, mostrarConfirmacionEdicion } from "./EditarComentarioModal";

export default function PostModal({ 
  post, 
  comentarios, 
  onClose, 
  usuarioActual, 
  onAgregarComentario,
  onEditarComentario,
  onEliminarComentario,
  usuarios 
}) {
  if (!post) return null;

  const comentariosDelPost = comentarios.filter(
    (c) => c.idp === post.idp && c.fechorAut != "" && c.fechorAut != null
  );

  const handleAgregarComentario = (contenido, likeNotLike) => {
    const comentario = {
      consec: Date.now(),
      contenidoCom: contenido,
      fechorCom: new Date().toISOString(),
      likeNotLike: likeNotLike,
      fechorAut: new Date().toISOString(),
      idp: post.idp,
      idu: usuarioActual.idu,
    };

    onAgregarComentario(comentario);
  };

  const handleEditarComentario = async (comentario) => {
    const formValues = await mostrarModalEditarComentario(comentario);

    if (formValues) {
      const comentarioEditado = {
        ...comentario,
        contenidoCom: formValues.contenido,
        likeNotLike: formValues.likeNotLike,
        fechorCom: new Date().toISOString(),
      };

      onEditarComentario(comentarioEditado);
      mostrarConfirmacionEdicion();
    }
  };

  const handleEliminarComentario = async (comentario) => {
    const result = await Swal.fire({
      title: "¿Eliminar comentario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1a1a1a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      onEliminarComentario(comentario.consec);
      
      Swal.fire({
        title: "Comentario eliminado",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#646cff",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-lg shadow-xl border border-[#646cff]/40 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Post */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#646cff] mb-2">
              Post de {post.autor.nombre}
            </h2>
            <p className="text-white/90">{post.contenido}</p>
          </div>

          <hr className="border-[#646cff]/30 mb-4" />

          {/* Sección de Comentarios */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3 text-[#a3a3ff]">
              Comentarios ({comentariosDelPost.length})
            </h3>
            <ComentariosList 
              comentarios={comentariosDelPost}
              usuarios={usuarios}
              usuarioActual={usuarioActual}
              onEditar={handleEditarComentario}
              onEliminar={handleEliminarComentario}
            />
          </div>

          {/* Formulario para agregar comentario */}
          <ComentarioForm 
            onAgregar={handleAgregarComentario}
            usuarioActual={usuarioActual}
          />

          {/* Botón de cerrar */}
          <div className="text-right mt-4 pt-4 border-t border-[#646cff]/30">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#646cff]/20 hover:bg-[#646cff]/30 text-[#646cff] rounded-lg transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}