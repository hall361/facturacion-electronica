document.getElementById("facturaForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const fecha = document.getElementById("fecha").value;
  const productos = document.getElementById("productos").value;
  const total = parseFloat(document.getElementById("total").value);
  const metodoPago = document.getElementById("metodoPago").value;
  const descuento = parseFloat(document.getElementById("descuento").value) || 0;
  const impuestos = parseFloat(document.getElementById("impuestos").value) || 0;

  const nuevaFactura = {
    cliente,
    fecha,
    productos: productos.split(",").map((producto) => producto.trim()),
    total,
    metodoPago,
    descuento,
    impuestos
  };

  try {
    const response = await fetch("http://localhost:3000/facturas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaFactura),
    });

    if (!response.ok) {
      throw new Error("Error al registrar la factura.");
    }

    const resultado = await response.json();
    alert("Factura registrada exitosamente.");
    console.log(resultado);
    document.getElementById("facturaForm").reset();
  } catch (error) {
    console.error(error);
    alert("Hubo un error al registrar la factura.");
  }
});