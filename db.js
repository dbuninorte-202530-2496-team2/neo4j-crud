import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config(); 


const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

async function verifyConnection() {
  try {
    const session = driver.session({ database: process.env.NEO4J_DATABASE });
    await session.run("RETURN 1");
    console.log("Conexión establecida con Neo4j AuraDB correctamente");
    await session.close();
  } catch (error) {
    console.error("Error conectando a Neo4j AuraDB:", error);
  }
}

verifyConnection();

export default driver;
