import express from "express";
import driver from "./db.js";

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Servidor Neo4j funcionando correctamente");
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));