const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Middleware para analizar JSON
app.use(express.json());

// Función para manejar operaciones en los JSON
function manejarDatos(ruta, req, res, metodo) {
  const filePath = path.join(__dirname, `data/${ruta}`);
  const carpetaPath = path.join(__dirname, "data");

  // Verifica si la carpeta "data" existe
  if (!fs.existsSync(carpetaPath)) {
    fs.mkdirSync(carpetaPath); // Crea la carpeta si no existe
  }

  if (metodo === "GET") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err && err.code === "ENOENT") {
        fs.writeFile(filePath, JSON.stringify([], null, 2), (err) => {
          if (err) return res.status(500).json({ error: "Error al crear el archivo." });
          res.json([]); // Archivo creado y devuelto como vacío
        });
      } else if (err) {
        return res.status(500).json({ error: "Error al leer el archivo." });
      } else {
        try {
          res.json(JSON.parse(data));
        } catch (parseError) {
          res.status(500).json({ error: "Error al analizar el archivo JSON." });
        }
      }
    });
  } else if (metodo === "POST") {
    const nuevoDato = req.body;

    // Validar que el cuerpo de la solicitud no esté vacío
    if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
      return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío." });
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err && err.code === "ENOENT") {
        fs.writeFile(filePath, JSON.stringify([nuevoDato], null, 2), (err) => {
          if (err) return res.status(500).json({ error: "Error al guardar los datos." });
          res.json({ mensaje: "Archivo creado y dato agregado.", contenido: [nuevoDato] });
        });
      } else if (err) {
        return res.status(500).json({ error: "Error al leer el archivo." });
      } else {
        try {
          const contenido = JSON.parse(data);
          contenido.push(nuevoDato);
          fs.writeFile(filePath, JSON.stringify(contenido, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error al guardar los datos." });
            res.json({ mensaje: "Elemento agregado correctamente.", contenido });
          });
        } catch (parseError) {
          res.status(500).json({ error: "Error al analizar el archivo JSON." });
        }
      }
    });
  }
}

// Endpoints para manejar JSON de registros, productos, facturas y reportes
["registro", "productos", "facturas", "reportes"].forEach((archivo) => {
  app.get(`/${archivo}`, (req, res) => manejarDatos(`${archivo}.json`, req, res, "GET"));
  app.post(`/${archivo}`, (req, res) => manejarDatos(`${archivo}.json`, req, res, "POST"));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});