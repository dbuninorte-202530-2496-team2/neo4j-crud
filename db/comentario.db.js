import { getNeo4jDriver } from "../config/db.js";
let driver;

export const comentarioDB = {
	async init() {
		driver = await getNeo4jDriver();
	},

	async create(createDto) {
		const { idp, idu, contenidoCom, likeNotLike } = createDto;
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:POST {idp: $idp})
				 MATCH (u:USUARIO {idu: $idu})
				 MATCH (autor:USUARIO)-[:publica]->(p)
				 
				 // Obtener el siguiente consec para este post
				 OPTIONAL MATCH (p)-[:tiene]->(existing:COMENTARIO)
				 WITH p, u, autor, COALESCE(MAX(existing.consec), 0) + 1 as nuevoConsec
				 
				 // Crear el comentario
				 CREATE (c:COMENTARIO {
					 idp: $idp,
					 consec: nuevoConsec,
					 contenidoCom: $contenidoCom,
					 likeNotLike: $likeNotLike,
					 fechorCom: datetime({timezone: 'America/Bogota'}),
					 fechorAut: CASE WHEN u.idu = autor.idu 
					            THEN datetime({timezone: 'America/Bogota'}) 
					            ELSE null END
				 })
				 
				 // Crear relaciones
				 CREATE (u)-[:hace]->(c)
				 CREATE (p)-[:tiene]->(c)
				 CREATE (c)-[:autoriza]->(u)
				 
				 RETURN c, u.idu as idu, u.nombre as nombre, 
				        p.idp as idp, (u.idu = autor.idu) as autoAutorizado`,
				{ idp, idu, contenidoCom, likeNotLike }
			);

			if (result.records.length === 0) return null;

			const record = result.records[0];
			const comentario = record.get('c').properties;

			return {
				...comentario,
				idp: comentario.idp,
				consec: comentario.consec,
				usuario: {
					idu: record.get('idu'),
					nombre: record.get('nombre')
				},
				autoAutorizado: record.get('autoAutorizado')
			};
		} finally {
			await session.close();
		}
	},

	async getAll() {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO)-[:hace]->(c:COMENTARIO)<-[:tiene]-(p:POST)
				 RETURN c, u.idu as idu, u.nombre as nombre, p.idp as idp ORDER BY c.consec DESC`
			);
			return result.records.map(record => {
				const c = record.get("c").properties;
				return {
					...c,
					idp: c.idp,
					consec: c.consec,
					usuario: {
						idu: record.get("idu"),
						nombre: record.get("nombre"),
					},
				};
			});
		} finally {
			await session.close();
		}
	},

	async getByPost(idp) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:POST {idp: $idp})-[:tiene]->(c:COMENTARIO)<-[:hace]-(u:USUARIO)
				 RETURN c, u.idu as idu, u.nombre as nombre
				 ORDER BY c.consec ASC`,
				{ idp }
			);
			return result.records.map(record => {
				const c = record.get("c").properties;
				return {
					...c,
					idp: c.idp,
					consec: c.consec,
					usuario: {
						idu: record.get("idu"),
						nombre: record.get("nombre")
					}
				};
			});
		} finally {
			await session.close();
		}
	},

	async getOneById(idp, consec) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (u:USUARIO)-[:hace]->(c:COMENTARIO {idp: $idp, consec: $consec})<-[:tiene]-(p:POST)
				 RETURN c, u.idu as idu, u.nombre as nombre, p.idp as idp`,
				{ idp, consec }
			);
			if (result.records.length === 0) return null;

			const record = result.records[0];
			const c = record.get('c').properties;
			return {
				...c,
				idp: c.idp,
				consec: c.consec,
				usuario: {
					idu: record.get("idu"),
					nombre: record.get("nombre")
				},
			};
		} finally {
			await session.close();
		}
	},

	async authorize(idp, consec, iduAutorizador) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:POST {idp: $idp})<-[:publica]-(autor:USUARIO)
				 MATCH (p)-[:tiene]->(c:COMENTARIO {idp: $idp, consec: $consec})
				 WHERE autor.idu = $iduAutorizador AND c.fechorAut IS NULL
				 SET c.fechorAut = datetime({timezone: 'America/Bogota'})
				 RETURN c, autor.idu as autorizadorId`,
				{ idp, consec, iduAutorizador }
			);

			if (result.records.length === 0) return null;

			const c = result.records[0].get('c').properties;
			return {
				...c,
				idp: c.idp,
				consec: c.consec,
			};
		} finally {
			await session.close();
		}
	},

	async updateOne(idp, consec, contenidoCom, likeNotLike) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (c:COMENTARIO {idp: $idp, consec: $consec})
				 SET c.contenidoCom = $contenidoCom,
				     c.likeNotLike = $likeNotLike,
				     c.fechorCom = datetime({timezone: 'America/Bogota'})
				 RETURN c`,
				{ idp, consec, contenidoCom, likeNotLike }
			);
			if (result.records.length === 0) return null;

			const c = result.records[0].get("c").properties;
			return {
				...c,
				idp: c.idp,
				consec: c.consec
			};
		} finally {
			await session.close();
		}
	},

	async delete(idp, consec) {
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (c:COMENTARIO {idp: $idp, consec: $consec})
				 DETACH DELETE c
				 RETURN COUNT(c) AS count`,
				{ idp, consec }
			);
			const count = result.records[0].get("count").toNumber();
			return count > 0;
		} finally {
			await session.close();
		}
	}
};
