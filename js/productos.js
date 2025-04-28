document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productoForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value.trim();
      const precio = parseFloat(document.getElementById("precio").value);
      const cantidad = parseInt(document.getElementById("cantidad").value);
  
      if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert("Todos los campos son obligatorios.");
        return;
      }
  
      fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, precio, cantidad }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud al servidor.");
          }
          return response.json();
        })
        .then((data) => {
          alert("Producto registrado exitosamente.");
          form.reset();
        })
        .catch((error) => {
          console.error("Error al registrar el producto:", error);
          alert("Hubo un error al registrar el producto.");
        });
    });
  });