import express from "express";
import driver from "../db.js";

const router = express.Router();

//Crear usuarios
router.post("/", async (req, res) => {
  const { nombre, email } = req.body;
  const session = driver.session();
  try {
    await session.run(
      "CREATE (u:Usuario {nombre: $nombre, email: $email}) RETURN u",
      { nombre, email }
    );
    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
  
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

//Obtener todos los usuarios
router.get("/", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (u:Usuario) RETURN u");
    const usuarios = result.records.map(record => record.get("u").properties);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

//Obtener un usuario por email
router.get("/:email", async (req, res) => {
  const session = driver.session();
  const { email } = req.params;
  try {
    const result = await session.run(
      "MATCH (u:Usuario {email: $email}) RETURN u",
      { email }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    const usuario = result.records[0].get("u").properties;
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

//Actualizar un usuario por email
router.put("/:email", async (req, res) => {
  const session = driver.session();
  const { email } = req.params;      
  const { nombre, nuevoEmail } = req.body; 
  try {
    const result = await session.run(
      `MATCH (u:Usuario {email: $email})
       SET u.nombre = $nombre, u.email = $nuevoEmail
       RETURN u`,
      { email, nombre, nuevoEmail }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = result.records[0].get("u").properties;
    res.json({ mensaje: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});


//Eliminar un usuario por email
router.delete("/:email", async (req, res) => {
  const session = driver.session();
  const { email } = req.params;
  try {
    const result = await session.run(
      "MATCH (u:Usuario {email: $email}) DETACH DELETE u RETURN COUNT(u) AS count",
      { email }
    );

    const count = result.records[0].get("count").toNumber();
    if (count === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});


export default router; 
