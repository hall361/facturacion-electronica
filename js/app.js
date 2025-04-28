document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  // Enviar un nuevo registro al backend
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const nit = document.getElementById("nit").value;
    const correo = document.getElementById("correo").value;

    // Enviar los datos al backend
    fetch("http://localhost:3000/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, nit, correo }),
    })
      .then((response) => response.json())
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