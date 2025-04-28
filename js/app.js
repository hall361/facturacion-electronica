document.getElementById("registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const nuevoRegistro = {
      nombreComercio: document.getElementById("nombre").value,
      nit: document.getElementById("nit").value,
      correo: document.getElementById("correo").value,
    };
  
    const respuesta = await fetch("http://localhost:3000/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoRegistro),
    });
  
    const resultado = await respuesta.json();
    alert(resultado.mensaje);
  });