import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UsuariosPage({ users }) {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState(users);
  const [seleccionado, setSeleccionado] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState("");

  const handleSeleccion = (id) => {
    setSeleccionado(prev => prev === id ? null : id);
  };

  const handleAgregarUsuario = () => {
    if (nuevoUsuario.trim() === "") return;
    const nuevo = { idu: users.length + 1, nombre: nuevoUsuario };
    setUsuarios((prev) => [...prev, nuevo]);
    setNuevoUsuario("");
  };

  const handleIrAOtraPagina = () => {
    const usuarioSeleccionado = usuarios.find(u => u.idu === seleccionado);
    navigate("/usuario", { state: { usuario: usuarioSeleccionado } });
  };

  const baseButtonClass = "rounded-lg border border-transparent bg-[#1a1a1a] text-[rgba(255,255,255,0.87)] px-5 py-2.5 text-base font-medium font-[inherit] cursor-pointer transition-[border-color] duration-[250ms] hover:border-[#646cff] focus:outline-[4px] focus:outline-[auto] focus:outline-[-webkit-focus-ring-color] focus-visible:outline-[4px] focus-visible:outline-[auto] focus-visible:outline-[-webkit-focus-ring-color]";

  return (
    <div 
      className="min-h-screen bg-[#242424] text-[rgba(255,255,255,0.87)] flex flex-col items-center justify-center p-6"
      style={{
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        lineHeight: '1.5',
        fontWeight: '400',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <div className="w-full max-w-lg">
        <h1 
          className="font-normal mb-8"
          style={{ fontSize: '3.2em', lineHeight: '1.1' }}
        >
          ¿Con qué usuario desea acceder?
        </h1>

        <div className="flex items-center justify-between mb-3">
          <ul className="list-none p-0 mb-8">
            {usuarios.map((u) => (
              <li key={u.idu} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="usuario"
                  checked={seleccionado === u.idu}
                  onChange={() => handleSeleccion(u.idu)}
                  className="mr-2 cursor-pointer w-4 h-4"
                />
                <span className="text-base">{u.nombre}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={handleIrAOtraPagina}
            className={baseButtonClass}
            disabled={!seleccionado}
          >
            Acceder
          </button>

        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-base">
            Agregar nuevo usuario:
          </label>
          <input
            type="text"
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
            placeholder="Nombre del usuario"
            className="rounded-lg border border-transparent bg-[#1a1a1a] text-[rgba(255,255,255,0.87)] px-5 py-2.5 text-base font-medium font-[inherit] w-full mb-3 transition-[border-color] duration-[250ms] focus:outline-none focus:border-[#646cff] placeholder:text-[rgba(255,255,255,0.4)]"
          />
          <button 
            onClick={handleAgregarUsuario}
            className={baseButtonClass}
          >
            Agregar
          </button>
        </div>
        
        {!seleccionado && (
          <p className="text-sm text-white/50 mt-2">
            Selecciona un usuario para continuar
          </p>
        )}
      </div>
    </div>
  );
}