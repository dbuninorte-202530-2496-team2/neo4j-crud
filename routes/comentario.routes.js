import express from "express";
import { comentarioDB } from "../db/comentario.db.js";
import { CreateComentarioDto, UpdateComentarioDto, ComentarioIdDto, PositiveIntDto } from "../dto/index.js";

const comentarioRouter = express.Router();

// Obtener todos los comentarios
comentarioRouter.get("/", async (req, res) => {
	try {
		const comentarios = await comentarioDB.getAll();
		res.json(comentarios);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Obtener comentarios de un post
comentarioRouter.get("/post/:idp", async (req, res) => {
	try {
		const { error, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (error) return res.status(400).json({ error: error.message });

		const comentarios = await comentarioDB.getByPost(idp);
		res.json(comentarios);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Obtener un comentario específico
comentarioRouter.get("/:idp/:consec", async (req, res) => {
	try {
		const { error, value } = ComentarioIdDto.validate({
			idp: parseInt(req.params.idp),
			consec: parseInt(req.params.consec)
		});
		if (error) return res.status(400).json({ error: error.message });

		const { idp, consec } = value;
		const comentario = await comentarioDB.getOneById(idp, consec);

		if (!comentario) {
			return res.status(404).json({ error: 'Comentario no encontrado' });
		}
		res.json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener comentario' });
	}
});

// Crear comentario
comentarioRouter.post("/", async (req, res) => {
	try {
		const { error, value } = CreateComentarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const comentario = await comentarioDB.create(value);
		if (!comentario) {
			return res.status(404).json({ error: 'Post o Usuario no encontrado' });
		}
		res.status(201).json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Autorizar comentario (solo dueño del post)
comentarioRouter.patch("/:idp/:consec/authorize", async (req, res) => {
	try {
		const { error, value } = ComentarioIdDto.validate({
			idp: parseInt(req.params.idp),
			consec: parseInt(req.params.consec)
		});
		if (error) return res.status(400).json({ error: error.message });

		const { idp, consec } = value;
		const { idu } = req.body; // En producción vendría del token/sesión

		if (!idu) {
			return res.status(400).json({ error: 'Se requiere idu del autorizador' });
		}

		const comentario = await comentarioDB.authorize(idp, consec, idu);
		if (!comentario) {
			return res.status(403).json({ error: 'No tienes permiso para autorizar este comentario o ya está autorizado' });
		}
		res.json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Actualizar comentario
comentarioRouter.put("/:idp/:consec", async (req, res) => {
	try {
		const { error: e, value } = ComentarioIdDto.validate({
			idp: parseInt(req.params.idp),
			consec: parseInt(req.params.consec)
		});
		if (e) return res.status(400).json({ error: e.message });

		const { error, value: body } = UpdateComentarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const { idp, consec } = value;
		const { contenidoCom, likeNotLike } = body;

		const comentario = await comentarioDB.updateOne(idp, consec, contenidoCom, likeNotLike);

		if (!comentario) {
			return res.status(404).json({ error: 'Comentario no encontrado' });
		}
		res.json(comentario);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Eliminar comentario
comentarioRouter.delete("/:idp/:consec", async (req, res) => {
	try {
		const { error, value } = ComentarioIdDto.validate({
			idp: parseInt(req.params.idp),
			consec: parseInt(req.params.consec)
		});
		if (error) return res.status(400).json({ error: error.message });

		const { idp, consec } = value;
		const deleted = await comentarioDB.delete(idp, consec);

		if (!deleted) {
			return res.status(404).json({ error: "Comentario no encontrado" });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default comentarioRouter;
