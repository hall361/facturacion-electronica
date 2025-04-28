const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express(); // Inicializar Express
const port = 3000;

// Middleware para analizar JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Función para manejar operaciones en los JSON
function manejarDatos(ruta, req, res, metodo) {
  const filePath = path.join(__dirname, `data/${ruta}`);
  const carpetaPath = path.join(__dirname, "data");

  if (!fs.existsSync(carpetaPath)) {
    fs.mkdirSync(carpetaPath);
  }

  if (metodo === "GET") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err && err.code === "ENOENT") {
        fs.writeFile(filePath, JSON.stringify([], null, 2), (err) => {
          if (err) return res.status(500).json({ error: "Error al crear el archivo." });
          res.json([]);
        });
      } else if (err) {
        return res.status(500).json({ error: "Error al leer el archivo." });
      } else {
        try {
          res.json(JSON.parse(data));
        } catch {
          res.status(500).json({ error: "Error al analizar el archivo JSON." });
        }
      }
    });
  } else if (metodo === "POST") {
    const nuevoDato = req.body;

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
        } catch {
          res.status(500).json({ error: "Error al analizar el archivo JSON." });
        }
      }
    });
  }
}

// Endpoint para generar el reporte de ventas
app.get("/ventas", (req, res) => {
  const filePath = path.join(__dirname, "data/facturas.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer el archivo de facturas." });
    }

    try {
      const facturas = JSON.parse(data);

      if (!Array.isArray(facturas) || facturas.length === 0) {
        return res.json({ mensaje: "No hay facturas registradas." });
      }

      // Procesar las facturas para generar el reporte de ventas
      const reporteVentas = facturas.map((factura) => ({
        cliente: factura.cliente,
        fecha: factura.fecha,
        productos: factura.productos,
        total: factura.total,
        metodoPago: factura.metodoPago
      }));

      res.json(reporteVentas);
    } catch {
      return res.status(500).json({ error: "Error al analizar el archivo JSON." });
    }
  });
});

// Endpoints para manejar JSON de registros, productos y facturas
["registro", "productos", "facturas"].forEach((archivo) => {
  app.get(`/${archivo}`, (req, res) => manejarDatos(`${archivo}.json`, req, res, "GET"));
  app.post(`/${archivo}`, (req, res) => manejarDatos(`${archivo}.json`, req, res, "POST"));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});