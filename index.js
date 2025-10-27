import express from "express";
import dotenv from 'dotenv';
dotenv.config();

import usuarioRouter from "./routes/usuarios.js";
import { closeNeo4jDriver, getNeo4jDriver } from "./config/db.js";
import { usuarioDB } from "./db/usuario.db.js";

const app = express();
app.use(express.json());

app.use('/users', usuarioRouter)

app.get("/", (req, res) => {
	res.send("Servidor Neo4j funcionando correctamente");
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

//Apagar servidor
const shutdown = async () => {
	console.log('Se apagará el servidor...');
	try {
		server.close(() => console.log('Servidor cerrado.'));
		await closeNeo4jDriver();
		console.log('Servidor cerrado.');
		process.exit(0); //Cerrado normalmente
	} catch (err) {
		console.error('Error al apagar:', err);
		process.exit(1); //Problemas al cerrar
	}
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

//Inicialización de acceso a la base de datos
try {
	await getNeo4jDriver();
	await usuarioDB.init();
} catch (error) {
	console.log(`Error al acceder al driver: ${error.message}`)
	await shutdown();
}



