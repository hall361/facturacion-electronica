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
          if (err) return res.status(500).send("Error al crear el archivo.");
          res.send([]); // Archivo creado y devuelto como vacío
        });
      } else if (err) {
        return res.status(500).send("Error al leer el archivo.");
      } else {
        res.send(JSON.parse(data));
      }
    });
  } else if (metodo === "POST") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err && err.code === "ENOENT") {
        fs.writeFile(filePath, JSON.stringify([req.body], null, 2), (err) => {
          if (err) return res.status(500).send("Error al guardar los datos.");
          res.send({ mensaje: "Archivo creado y dato agregado.", contenido: [req.body] });
        });
      } else if (err) {
        return res.status(500).send("Error al leer el archivo.");
      } else {
        const contenido = JSON.parse(data);
        contenido.push(req.body);
        fs.writeFile(filePath, JSON.stringify(contenido, null, 2), (err) => {
          if (err) return res.status(500).send("Error al guardar los datos.");
          res.send({ mensaje: "Elemento agregado correctamente.", contenido });
        });
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