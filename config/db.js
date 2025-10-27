import neo4j from "neo4j-driver";

let driver;

export async function getNeo4jDriver() {
	if (driver) return driver;

	try {

		driver = neo4j.driver(
			process.env.NEO4J_URI,
			neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
		);
		const serverInfo = await driver.getServerInfo()
		console.log('Conexión establecida con la instancia')
		console.log(serverInfo)

	} catch (error) {
		throw error;
	}
}

export async function closeNeo4jDriver() {
	if (!driver) return;
	await driver.close();
}
