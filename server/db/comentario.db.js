import neo4j from 'neo4j-driver';
import { getNeo4jDriver } from "../config/db.js";
let driver;

export const comentarioDB = {
	async init() {
		driver = await getNeo4jDriver();
	},

	async create(createDto) {
		let { idp, idu, contenidoCom, likeNotLike } = createDto;
		idp = neo4j.int(idp);
		const session = driver.session();
		try {
			const result = await session.run(
				`MATCH (p:POST {idp: $idp})
			 MATCH (u:USUARIO {idu: $idu})
			 MATCH (autor:USUARIO)-[:publica]->(p)
			 
			 OPTIONAL MATCH (p)-[:tiene]->(existing:COMENTARIO)
			 WITH p, u, autor, COALESCE(MAX(existing.consec), 0) + 1 as nuevoConsec
			 
			 CREATE (c:COMENTARIO {
				 idp: $idp,
				 consec: nuevoConsec,
				 contenidoCom: $contenidoCom,
				 likeNotLike: $likeNotLike,
				 fechorCom: localdatetime(),
				 fechorAut: CASE WHEN u.idu = autor.idu 
				            THEN localdatetime() 
				            ELSE null END
			 })
			 
			 CREATE (u)-[:hace]->(c)
			 CREATE (p)-[:tiene]->(c)
			 CREATE (c)-[:autoriza]->(u)
			 
			 RETURN c, u.idu as idu, u.nombre as nombre, 
			        p.idp as idp, (u.idu = autor.idu) as autoAutorizado`,
				{ idp, idu, contenidoCom, likeNotLike }
			);

			if (result.records.length === 0) {
				// Verificar qué falló
				const checkPost = await session.run(
					`MATCH (p:POST {idp: $idp}) RETURN p`,
					{ idp }
				);
				if (checkPost.records.length === 0) return { error: 1 }; // Post no encontrado

				const checkUser = await session.run(
					`MATCH (u:USUARIO {idu: $idu}) RETURN u`,
					{ idu }
				);
				if (checkUser.records.length === 0) return { error: 2 }; // Usuario no encontrado

				return { error: 3 }; // Post sin autor
			}

			const record = result.records[0];
			const comentario = record.get('c').properties;

			return {
				...comentario,
				idp: comentario.idp.toNumber(),
				consec: comentario.consec.toNumber(),
				fechorCom: comentario.fechorCom.toStandardDate(),
				fechorAut: comentario.fechorAut?.toStandardDate() ?? null,
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
					idp: c.idp.toNumber(),
					consec: c.consec.toNumber(),
					fechorCom: c.fechorCom.toStandardDate(),
					fechorAut: c.fechorAut?.toStandardDate() ?? null,
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
				 WHERE NOT u.nombre IN ['ANONIMO', 'MANAGER']
				 RETURN c, u.idu as idu, u.nombre as nombre
				 ORDER BY c.consec ASC`,
				{ idp }
			);
			return result.records.map(record => {
				const c = record.get("c").properties;
				return {
					...c,
					idp: c.idp.toNumber(),
					consec: c.consec.toNumber(),
					fechorCom: c.fechorCom.toStandardDate(),
					fechorAut: c.fechorAut?.toStandardDate() ?? null,
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
				fechorCom: c.fechorCom.toStandardDate(),
				fechorAut: c.fechorAut?.toStandardDate() ?? null,
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
				 SET c.fechorAut = localdatetime()
				 RETURN c, autor.idu as autorizadorId`,
				{ idp, consec, iduAutorizador }
			);

			if (result.records.length === 0) return null;

			const c = result.records[0].get('c').properties;
			return {
				...c,
				idp: c.idp.toNumber(),
				consec: c.consec.toNumber(),
				fechorCom: c.fechorCom.toStandardDate(),
				fechorAut: c.fechorAut?.toStandardDate() ?? null,
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
				     c.fechorCom = localdatetime()
				 RETURN c`,
				{ idp, consec, contenidoCom, likeNotLike }
			);
			if (result.records.length === 0) return null;

			const c = result.records[0].get("c").properties;
			return {
				...c,
				fechorCom: c.fechorCom.toStandardDate(),
				fechorAut: c.fechorAut?.toStandardDate() ?? null,
				idp: c.idp.toNumber(),
				consec: c.consec.toNumber()
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
