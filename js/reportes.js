document.getElementById("reporteForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const tablaHead = document.getElementById("tablaHead");
  const tablaBody = document.getElementById("tablaBody");

  // Limpiar tabla
  tablaHead.innerHTML = "";
  tablaBody.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:3000/${tipo}`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del servidor.");
    }

    const datos = await response.json();

    if (datos.length === 0) {
      tablaBody.innerHTML = "<tr><td colspan='100%'>No hay datos disponibles.</td></tr>";
      return;
    }

    // Crear encabezados de la tabla
    const encabezados = Object.keys(datos[0]);
    const headRow = document.createElement("tr");
    encabezados.forEach((encabezado) => {
      const th = document.createElement("th");
      th.textContent = encabezado;
      headRow.appendChild(th);
    });
    tablaHead.appendChild(headRow);

    // Crear filas de la tabla
    datos.forEach((dato) => {
      const row = document.createElement("tr");
      encabezados.forEach((encabezado) => {
        const td = document.createElement("td");
        td.textContent = Array.isArray(dato[encabezado])
          ? dato[encabezado].join(", ")
          : dato[encabezado];
        row.appendChild(td);
      });
      tablaBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    tablaBody.innerHTML = "<tr><td colspan='100%'>Error al cargar los datos.</td></tr>";
  }
});