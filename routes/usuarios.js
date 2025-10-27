import express from "express";
import { getNeo4jDriver } from "../config/db.js";
import { usuarioDB } from "../db/usuario.db.js";

const usuarioRouter = express.Router();

//Obtener todos los usuarios
usuarioRouter.get("/", async (req, res) => {
	try {
		const usuarios = await usuarioDB.getAll();
		res.json(usuarios);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

//Obtener un usuario por email
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

//Crear usuarios
usuarioRouter.post("/", async (req, res) => {
	try {
		const usuario = await usuarioDB.create(req.body.nombre);
		res.status(201).json(usuario)
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

//Actualizar un usuario por email
usuarioRouter.put("/:idu", async (req, res) => {
	const { idu } = req.params;
	const { nombre } = req.body;

	try {
		const usuario = await usuarioDB.updateOne(idu, nombre)

		if (!usuario)
			return res.status(404).json({ error: 'Usuario no encontrado' });

		res.json(usuario);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});


//Eliminar un usuario por email
usuarioRouter.delete("/:idu", async (req, res) => {
	const { idu } = req.params;
	try {
		const deleted = await usuarioDB.delete(idu);

		if (!deleted)
			return res.status(404).json({ mensaje: "Usuario no encontrado" });

		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});


export default usuarioRouter; 
