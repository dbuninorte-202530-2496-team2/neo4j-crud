import neo4j from 'neo4j-driver';
import { getNeo4jDriver } from "../config/db.js";
let driver;
export const postDB = {
	async init() {
		driver = await getNeo4jDriver();
		// Inicializar el contador si no existe
		const session = driver.session();
		try {
			await session.run(
				`MERGE (c:COUNTER {name: 'postId'})
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
				`MATCH (u:USUARIO {idu: $idu})
				 MATCH (c:COUNTER {name: 'postId'})
				 SET c.value = c.value + 1
				 WITH u, c.value as idp
				 CREATE (p:POST {idp: idp, contenido: $contenido})
				 CREATE (u)-[:publica]->(p)
				 RETURN p`,
				{ contenido, idu }
			);
			if (result.records.length === 0) return null;
			const post = result.records[0].get('p').properties;
			return {
				...post,
				idp: post.idp.toNumber()
			};
		} finally {
			await session.close();
		}
	},
	async getAll() {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO)-[:publica]->(p:POST)
				 RETURN p, u.idu as idu, u.nombre as nombre
				 ORDER BY p.idp DESC`
			);
			return result.records.map(record => {
				const post = record.get("p").properties;
				return {
					...post,
					idp: post.idp.toNumber()
				};
			});
		} finally {
			await session.close();
		}
	},
	async getFeed(limit, offset) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO)-[:publica]->(p:POST)
				 RETURN p, u.idu as idu, u.nombre as nombre
				 ORDER BY p.idp DESC
				 SKIP $offset
				 LIMIT $limit`,
				{
					offset: neo4j.int(offset),
					limit: neo4j.int(limit)
				}
			);
			return result.records.map(record => {
				const post = record.get("p").properties;
				return {
					...post,
					idp: post.idp.toNumber(),
					autor: {
						idu: record.get("idu"),
						nombre: record.get("nombre")
					}
				};
			});
		} finally {
			await session.close();
		}
	},
	async getOneById(idp) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO)-[:publica]->(p:POST {idp: $idp})
				 RETURN p, u.idu as idu, u.nombre as nombre`,
				{ idp }
			);
			if (result.records.length === 0) return null;
			const record = result.records[0];
			const post = record.get('p').properties;
			return {
				...post,
				idp: post.idp.toNumber(),
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
				`MATCH (p:POST {idp: $idp})
				 SET p.contenido = $contenido
				 RETURN p`,
				{ idp, contenido }
			);
			if (result.records.length === 0) return null;
			const post = result.records[0].get("p").properties;
			return {
				...post,
				idp: post.idp.toNumber()
			};
		} finally {
			await session.close();
		}
	},
	async delete(idp) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:POST {idp: $idp})
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
