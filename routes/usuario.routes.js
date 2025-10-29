import express from "express";
import { usuarioDB } from "../db/usuario.db.js";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dto/index.js";

const usuarioRouter = express.Router();

// Obtener todos los usuarios
usuarioRouter.get("/", async (req, res) => {
	try {
		const usuarios = await usuarioDB.getAll();
		res.json(usuarios);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Obtener un usuario por idu
usuarioRouter.get("/:idu", async (req, res) => {
	try {
		const usuario = await usuarioDB.getOneById(req.params.idu);
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		res.json(usuario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener usuario' });
	}
});

// Crear usuario
usuarioRouter.post("/", async (req, res) => {
	try {
		const { error, value } = CreateUsuarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const { nombre } = value;
		const usuario = await usuarioDB.create(nombre);
		res.status(201).json(usuario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Actualizar un usuario
usuarioRouter.put("/:idu", async (req, res) => {
	try {
		const { idu } = req.params;

		const { error, value } = UpdateUsuarioDto.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		const { nombre } = value;
		const usuario = await usuarioDB.updateOne(idu, nombre);

		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		res.json(usuario);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Eliminar un usuario
usuarioRouter.delete("/:idu", async (req, res) => {
	try {
		const { idu } = req.params;
		const deleted = await usuarioDB.delete(idu);

		if (!deleted) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default usuarioRouter;
