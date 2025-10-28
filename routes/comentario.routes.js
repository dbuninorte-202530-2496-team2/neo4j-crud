import express from "express";
import { comentarioDB } from "../db/comentario.db.js";
import { CreateComentarioDto, PositiveIntDto, UpdateComentarioDto } from "../dto/index.js";

const comentarioRouter = express.Router();

comentarioRouter.get("/", async (req, res) => {
	try {
		const comentarios = await comentarioDB.getAll();
		res.json(comentarios);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

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

comentarioRouter.get("/:idp/:consec", async (req, res) => {
	try {
		const { error: errorIdp, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (errorIdp) return res.status(400).json({ error: errorIdp.message });

		const { error: errorConsec, value: consec } = PositiveIntDto.validate(req.params.consec);
		if (errorConsec) return res.status(400).json({ error: errorConsec.message });

		const comentario = await comentarioDB.getOneById(idp, consec);
		if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

		res.json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener comentario' });
	}
});

comentarioRouter.post("/", async (req, res) => {
	try {
		const { error, value } = CreateComentarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const comentario = await comentarioDB.create(value);
		res.status(201).json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

comentarioRouter.patch("/:idp/:consec/authorize", async (req, res) => {
	try {
		const { error: errorIdp, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (errorIdp) return res.status(400).json({ error: errorIdp.message });

		const { error: errorConsec, value: consec } = PositiveIntDto.validate(req.params.consec);
		if (errorConsec) return res.status(400).json({ error: errorConsec.message });

		const { error, value } = AutorizarComentarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const comentario = await comentarioDB.authorize(idp, consec, value.iduAutorizador);
		if (!comentario) {
			return res.status(404).json({
				error: 'Comentario no encontrado o ya autorizado, o no eres el autor del post'
			});
		}

		res.json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

comentarioRouter.put("/:idp/:consec", async (req, res) => {
	try {
		const { error: errorIdp, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (errorIdp) return res.status(400).json({ error: errorIdp.message });

		const { error: errorConsec, value: consec } = PositiveIntDto.validate(req.params.consec);
		if (errorConsec) return res.status(400).json({ error: errorConsec.message });

		const { error, value: body } = UpdateComentarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const { contenidoCom, likeNotLike } = body;
		const comentario = await comentarioDB.updateOne(idp, consec, contenidoCom, likeNotLike);

		if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

		res.json(comentario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

comentarioRouter.delete("/:idp/:consec", async (req, res) => {
	try {
		const { error: errorIdp, value: idp } = PositiveIntDto.validate(req.params.idp);
		if (errorIdp) return res.status(400).json({ error: errorIdp.message });

		const { error: errorConsec, value: consec } = PositiveIntDto.validate(req.params.consec);
		if (errorConsec) return res.status(400).json({ error: errorConsec.message });

		const deleted = await comentarioDB.delete(idp, consec);
		if (!deleted) {
			return res.status(404).json({ error: "Comentario no encontrado" });
		}

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

export default comentarioRouter;
