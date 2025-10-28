import { getNeo4jDriver } from "../config/db.js";
let driver;

export const postDB = {
	async init() {
		driver = await getNeo4jDriver();
		// Inicializar el contador si no existe
		const session = driver.session();
		try {
			await session.run(
				`MERGE (c:Counter {name: 'postId'})
				 ON CREATE SET c.value = 0`
			);
		} finally {
			await session.close();
		}
	},

	async create(contenido, idu) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:Usuario {idu: $idu})
				 MATCH (c:Counter {name: 'postId'})
				 SET c.value = c.value + 1
				 WITH u, c.value as idp
				 CREATE (p:Post {idp: idp, contenido: $contenido})
				 CREATE (u)-[:publica]->(p)
				 RETURN p, u`,
				{ contenido, idu }
			);
			if (result.records.length === 0) {
				throw new Error('Usuario no encontrado');
			}
			return result.records[0].get('p').properties;
		} finally {
			await session.close();
		}
	},

	async getAll() {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:Usuario)-[:publica]->(p:Post)
				 RETURN p, u.idu as idu, u.nombre as nombre
				 ORDER BY p.idp DESC`
			);
			return result.records.map(record => ({
				...record.get("p").properties
			}));
		} finally {
			await session.close();
		}
	},

	async getFeed(limit = 20, offset = 0) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:Usuario)-[:publica]->(p:Post)
				 RETURN p, u.idu as idu, u.nombre as nombre
				 ORDER BY p.idp DESC
				 SKIP $offset
				 LIMIT $limit`,
				{ offset, limit }
			);
			return result.records.map(record => ({
				...record.get("p").properties,
				autor: {
					idu: record.get("idu"),
					nombre: record.get("nombre")
				}
			}));
		} finally {
			await session.close();
		}
	},

	async getOneById(idp) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:Usuario)-[:publica]->(p:Post {idp: $idp})
				 RETURN p, u.idu as idu, u.nombre as nombre`,
				{ idp }
			);
			if (result.records.length === 0) return null;
			const record = result.records[0];
			return {
				...record.get('p').properties,
				autor: {
					idu: record.get("idu"),
					nombre: record.get("nombre")
				}
			};
		} finally {
			await session.close();
		}
	},

	async updateOne(idp, contenido) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:Post {idp: $idp})
				 SET p.contenido = $contenido
				 RETURN p`,
				{ idp, contenido }
			);
			if (result.records.length === 0) return null;
			return result.records[0].get("p").properties;
		} finally {
			await session.close();
		}
	},

	async delete(idp) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:Post {idp: $idp})
				 DETACH DELETE p
				 RETURN COUNT(p) AS count`,
				{ idp }
			);
			const count = result.records[0].get("count").toNumber();
			return count > 0;
		} finally {
			await session.close();
		}
	}
};
