import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { closeNeo4jDriver, getNeo4jDriver } from "./config/db.js";
import { usuarioDB, postDB, comentarioDB } from "./db/index.js";
import { comentarioRouter, postRouter, usuarioRouter } from "./routes/index.js";

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/posts', postRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/comentarios', comentarioRouter);

app.get("/", (req, res) => {
	res.send("Servidor Neo4j funcionando correctamente");
});

const PORT = process.env.PORT || 3000;

let server;

// Apagar servidor
const shutdown = async () => {
	console.log('Apagando servidor...');
	try {
		if (server)
			server.close(() => console.log('Servidor HTTP cerrado.'));
		await closeNeo4jDriver();
		console.log('Conexión a Neo4j cerrada.');
		process.exit(0);
	} catch (err) {
		console.error('Error al apagar:', err);
		process.exit(1);
	}
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Inicialización
const startServer = async () => {
	try {
		console.log('Conectando a Neo4j...');
		await getNeo4jDriver();

		console.log('Inicializando modelos...');
		await usuarioDB.init();
		await postDB.init();
		await comentarioDB.init();

		console.log('Base de datos lista.');

		// Solo ahora iniciamos el servidor
		server = app.listen(PORT, () => {
			console.log(`Servidor escuchando en http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error(`Error al iniciar servidor: ${error.message}`);
		await shutdown();
	}
};

startServer();
