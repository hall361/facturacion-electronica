document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  // Enviar un nuevo registro al backend
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const nit = document.getElementById("nit").value.trim();
    const correo = document.getElementById("correo").value.trim();

    // Validar los campos
    if (!nombre || !nit || !correo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Enviar los datos al backend
    fetch("http://localhost:3000/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, nit, correo }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud al servidor.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registro guardado:", data);
        alert("Comercio registrado exitosamente.");
        form.reset(); // Limpiar el formulario
      })
      .catch((error) => {
        console.error("Error al guardar el registro:", error);
        alert("Hubo un error al registrar el comercio.");
      });
  });
});