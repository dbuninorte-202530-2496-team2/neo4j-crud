import { getNeo4jDriver } from "../config/db.js";
let driver;
export const usuarioDB = {
	async init() {
		driver = await getNeo4jDriver();
	},
	async create(nombre) {
		const session = driver.session();
		try {
			const result = await session.run(
				"CREATE (u:USUARIO {idu: randomUUID(), nombre: $nombre }) RETURN u",
				{ nombre }
			);
			return result.records[0].get('u').properties;
		} finally {
			await session.close();
		}
	},
	async getAll() {
		const session = driver.session();
		try {
			const result = await session.run("MATCH (u:USUARIO) RETURN u");
			return result.records.map(record => record.get("u").properties);
		} finally {
			await session.close();
		}
	},
	async getOneById(idu) {
		const session = driver.session();
		try {
			const result = await session.run(
				"MATCH (u:USUARIO {idu: $idu}) RETURN u",
				{ idu }
			);
			if (result.records.length === 0) return null;
			return result.records[0].get('u').properties;
		} finally {
			await session.close();
		}
	},
	async updateOne(idu, nombre) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO {idu: $idu})
       SET u.nombre = $nombre
       RETURN u`,
				{ idu, nombre }
			);
			if (result.records.length === 0) return null;
			return result.records[0].get("u").properties;
		} finally {
			await session.close();
		}
	},
	async delete(idu) {
		const session = driver.session();
		try {
			const result = await session.run(
				"MATCH (u:USUARIO {idu: $idu}) DETACH DELETE u RETURN COUNT(u) AS count",
				{ idu }
			);
			const count = result.records[0].get("count").toNumber();
			return count > 0;
		} finally {
			await session.close();
		}
	}
}
