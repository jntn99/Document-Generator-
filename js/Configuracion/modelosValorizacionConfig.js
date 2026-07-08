function textoTipoMaterialConfiguracion(tipoMaterial) {
  if (tipoMaterial === "MINERAL") {
    return "Mineral";
  }

  if (tipoMaterial === "METAL_FISICO") {
    return "Metal fisico";
  }

  return tipoMaterial || "";
}

function mostrarModelosValorizacionConfiguracion() {
  const tabla = document.getElementById("tablaModelosValorizacion");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  obtenerModelosValorizacion().forEach(modelo => {
    const fila = document.createElement("tr");
    const nombre = document.createElement("td");
    const tipoMaterial = document.createElement("td");
    const estado = document.createElement("td");

    nombre.textContent = modelo.nombre;
    tipoMaterial.textContent = textoTipoMaterialConfiguracion(modelo.tipoMaterial);
    estado.textContent = modelo.activo ? "Activo" : "Inactivo";

    fila.appendChild(nombre);
    fila.appendChild(tipoMaterial);
    fila.appendChild(estado);
    tabla.appendChild(fila);
  });
}

mostrarModelosValorizacionConfiguracion();
