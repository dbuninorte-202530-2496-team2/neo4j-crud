import Swal from "sweetalert2";

export async function mostrarModalEditarComentario(comentario) {
  const { value: formValues } = await Swal.fire({
    title: "Editar comentario",
    width: "500px",
    html: `
      <div style="text-align: left;">
        <label style="display: block; margin-bottom: 8px; color: #a3a3ff; font-weight: 500; font-size: 14px;">
          Contenido:
        </label>
        <textarea 
          id="swal-input-contenido" 
          class="swal2-textarea" 
          placeholder="Escribe aquí..."
          style="width: 100%; min-height: 80px; margin-bottom: 12px; background: #2a2a2a; color: white; border: 1px solid #646cff; border-radius: 8px; padding: 8px; font-size: 14px; resize: vertical;"
        >${comentario.contenidoCom}</textarea>
        
        <label style="display: block; margin-bottom: 8px; color: #a3a3ff; font-weight: 500; font-size: 14px;">
          Reacción:
        </label>
        <div style="display: flex; gap: 16px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input 
              type="radio" 
              name="likeNotLike" 
              value="like" 
              ${comentario.likeNotLike === "like" ? "checked" : ""}
              style="width: 16px; height: 16px; accent-color: #10b981; cursor: pointer;"
            />
            <span style="color: white; font-size: 14px;">👍 Like</span>
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input 
              type="radio" 
              name="likeNotLike" 
              value="not like"
              ${comentario.likeNotLike === "not like" ? "checked" : ""}
              style="width: 16px; height: 16px; accent-color: #ef4444; cursor: pointer;"
            />
            <span style="color: white; font-size: 14px;">👎 Not Like</span>
          </label>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    background: "#1a1a1a",
    color: "#fff",
    confirmButtonColor: "#646cff",
    cancelButtonColor: "#6c757d",
    customClass: {
      confirmButton: 'swal-btn-confirm',
      cancelButton: 'swal-btn-cancel'
    },
    didOpen: () => {
      // Asegurar que los radio buttons funcionen correctamente
      const radios = document.querySelectorAll('input[name="likeNotLike"]');
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          radios.forEach(r => r.checked = false);
          e.target.checked = true;
        });
      });
    },
    preConfirm: () => {
      const contenido = document.getElementById("swal-input-contenido").value;
      const likeNotLikeElement = document.querySelector('input[name="likeNotLike"]:checked');
      
      if (!contenido || contenido.trim() === "") {
        Swal.showValidationMessage("El comentario no puede estar vacío");
        return false;
      }

      if (!likeNotLikeElement) {
        Swal.showValidationMessage("Debes seleccionar una reacción");
        return false;
      }
      
      return { 
        contenido: contenido.trim(), 
        likeNotLike: likeNotLikeElement.value 
      };
    }
  });

  return formValues;
}

export function mostrarConfirmacionEdicion() {
  return Swal.fire({
    title: "Comentario editado",
    icon: "success",
    background: "#1a1a1a",
    color: "#fff",
    confirmButtonColor: "#646cff",
    timer: 1500,
    showConfirmButton: false
  });
}