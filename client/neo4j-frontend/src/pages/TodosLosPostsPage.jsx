import { useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/NavBar.jsx";
import PostItem from "../components/PostItem";
import PostModal from "../components/PostModal";

export default function TodosLosPostsPage({ posts: allPosts, comentarios: allComentarios, usuarios }) {
	const location = useLocation();
	const usuario = location.state?.usuario;
	const [postSeleccionado, setPostSeleccionado] = useState(null);

	// Estados locales para posts y comentarios
	const [posts, setPosts] = useState(allPosts);
	const [comentarios, setComentarios] = useState(allComentarios);
	const [filtro, setFiltro] = useState("todos"); // "todos", "anonimo", "manager"

	// Filtrar posts según la opción seleccionada
	const postsFiltrados = posts.filter((post) => {
		const nombreAutor = post.autor.nombre.toUpperCase();

		if (filtro === "anonimo") {
			return nombreAutor === "ANONIMO";
		} else if (filtro === "manager") {
			return nombreAutor === "MANAGER";
		} else {
			// "todos" - excluir ANONIMO y MANAGER
			return nombreAutor !== "ANONIMO" && nombreAutor !== "MANAGER";
		}
	});

	// 📌 Agregar comentario
	const handleAgregarComentario = (comentario) => {
		setComentarios((prev) => [...prev, comentario]);
	};

	// 📌 Editar comentario
	const handleEditarComentario = (comentarioEditado) => {
		setComentarios((prev) =>
			prev.map((c) =>
				c.consec === comentarioEditado.consec ? comentarioEditado : c
			)
		);
	};

	return (
		<div className="min-h-screen bg-[#242424] text-white/87">
			<Navbar usuario={usuario} />

			<div className="p-6 flex flex-col items-center">
				<h2 className="text-3xl font-bold mb-6">Publicaciones de todos los usuarios</h2>

				{/* Filtros */}
				<div className="w-full max-w-3xl mb-4 flex gap-3 justify-center flex-wrap">
					<button
						onClick={() => setFiltro("todos")}
						className={`px-4 py-2 rounded-lg font-medium transition-all ${filtro === "todos"
							? "bg-[#646cff] text-white"
							: "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
							}`}
					>
						👥 Usuarios ({posts.filter(p => p.autor.nombre.toUpperCase() !== "ANONIMO" && p.autor.nombre.toUpperCase() !== "MANAGER").length})
					</button>

					<button
						onClick={() => setFiltro("anonimo")}
						className={`px-4 py-2 rounded-lg font-medium transition-all ${filtro === "anonimo"
							? "bg-[#646cff] text-white"
							: "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
							}`}
					>
						🕵️ Anónimo ({posts.filter(p => p.autor.nombre.toUpperCase() === "ANONIMO").length})
					</button>

					<button
						onClick={() => setFiltro("manager")}
						className={`px-4 py-2 rounded-lg font-medium transition-all ${filtro === "manager"
							? "bg-[#646cff] text-white"
							: "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a] border border-[#646cff]/30"
							}`}
					>
						👔 Manager ({posts.filter(p => p.autor.nombre.toUpperCase() === "MANAGER").length})
					</button>
				</div>

				{/* Lista de posts filtrados */}
				<div className="w-full max-w-3xl space-y-4 overflow-y-auto max-h-[70vh] p-4 border border-[#646cff]/30 rounded-lg bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-[#646cff]/40 scrollbar-track-[#1a1a1a]">
					{postsFiltrados.length > 0 ? (
						postsFiltrados.map((post) => (
							<PostItem
								key={post.idp}
								post={post}
								usuario={post.autor}
								onClick={() => setPostSeleccionado(post)}
							/>
						))
					) : (
						<p className="text-center text-gray-400 py-8">
							No hay posts en esta categoría
						</p>
					)}
				</div>

				{/* Indicador de posts mostrados */}
				<p className="mt-4 text-sm text-white/50">
					Mostrando {postsFiltrados.length} de {posts.length} posts
				</p>
			</div>

			{/* Modal que se muestra al hacer click */}
			{postSeleccionado && (
				<PostModal
					post={postSeleccionado}
					comentarios={comentarios}
					usuarioActual={usuario}
					onClose={() => setPostSeleccionado(null)}
					onAgregarComentario={handleAgregarComentario}
					onEditarComentario={handleEditarComentario}
					usuarios={usuarios}
				/>
			)}
		</div>
	);
}
