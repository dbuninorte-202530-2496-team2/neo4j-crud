import express from "express";
import { postDB } from "../db/post.db.js";
import { CreatePostDto, PositiveIntDto, PaginationDto, UpdatePostDto } from "../dto/index.js";

const postRouter = express.Router();

// Feed de posts (más recientes primero)
postRouter.get("/feed", async (req, res) => {
	try {
		const { error, value } = PaginationDto.validate(req.query);
		if (error) return res.status(400).json({ error: error.message })

		const { limit, offset } = value;

		const posts = await postDB.getFeed(limit, offset);
		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Obtener todos los posts
postRouter.get("/", async (req, res) => {
	try {
		const posts = await postDB.getAll();
		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Obtener un post por id
postRouter.get("/:idp", async (req, res) => {
	try {
		const { error, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (error) return res.status(400).json({ error: error.message })

		const post = await postDB.getOneById(idp);

		if (!post) return res.status(404).json({ error: 'Post no encontrado' });

		res.json(post);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener post' });
	}
});

// Crear post 
postRouter.post("/", async (req, res) => {
	try {
		const { error, value } = CreatePostDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message })

		const { contenido, idu } = value;
		const post = await postDB.create(contenido, idu);
		res.status(201).json(post);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Actualizar un post (solo contenido)
postRouter.put("/:idp", async (req, res) => {
	try {
		const { error: e, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (e) return res.status(400).json({ error: e.message });

		const { error, value: contenido } = UpdatePostDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message })


		const post = await postDB.updateOne(idp, contenido);
		if (!post) {
			return res.status(404).json({ error: 'Post no encontrado' });
		}
		res.json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Eliminar un post
postRouter.delete("/:idp", async (req, res) => {
	try {

		const { error, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (error) return res.status(400).json({ error: error.message });

		const deleted = await postDB.delete(idp);
		if (!deleted) {
			return res.status(404).json({ mensaje: "Post no encontrado" });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default postRouter;
