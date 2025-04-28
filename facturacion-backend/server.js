const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());

const filePath = path.join(__dirname, "data/registro.json");

// Endpoint para obtener registros
app.get("/registro", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(200).send([]); // Si el archivo no existe, devuelve un array vacío
      }
      return res.status(500).send("Error al leer el archivo.");
    }
    res.send(JSON.parse(data));
  });
});

// Endpoint para guardar un nuevo registro
app.post("/registro", (req, res) => {
  const nuevoRegistro = req.body;
  fs.readFile(filePath, "utf8", (err, data) => {
    let registros = [];
    if (!err) {
      registros = JSON.parse(data);
    }
    registros.push(nuevoRegistro);
    fs.writeFile(filePath, JSON.stringify(registros, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error al guardar el registro.");
      }
      res.send({ mensaje: "Registro guardado correctamente.", registros });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});