function formatearMonedaExpediente(valor) {
  return Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function obtenerNombreProveedorExpediente(expediente) {
  if (!expediente || !expediente.proveedorId || typeof buscarCooperativa !== "function") {
    return "";
  }

  const proveedor = buscarCooperativa(expediente.proveedorId);
  return proveedor ? proveedor.nombre : expediente.proveedorId;
}

function obtenerNombreMaterialExpediente(expediente) {
  if (!expediente || typeof buscarConcentrado !== "function") {
    return "";
  }

  const materialId =
    expediente.materialId ||
    (
      expediente.tipoMaterial !== "MINERAL" &&
      expediente.tipoMaterial !== "METAL_FISICO"
        ? expediente.tipoMaterial
        : ""
    );

  if (!materialId) {
    return "";
  }

  const material = buscarConcentrado(materialId);
  return material ? material.nombre : materialId;
}

function formatearTipoMaterialExpediente(tipoMaterial) {
  if (tipoMaterial === "MINERAL") {
    return "Mineral";
  }

  if (tipoMaterial === "METAL_FISICO") {
    return "Metal fisico";
  }

  return tipoMaterial || "";
}

function formatearPresentacionExpediente(presentacionMaterial) {
  const presentaciones = {
    MINERAL_BRUTO: "Mineral en bruto",
    CONCENTRADO: "Concentrado",
    MATERIAL_SELECCIONADO: "Material seleccionado",
    GRANZA: "Granza",
    RELAVE: "Relave",
    LINGOTE: "Lingote",
    PEPAS: "Pepas",
    GRANALLADO: "Granallado",
    POLVO: "Polvo",
    SCRAP: "Scrap",
    OTRO: "Otro"
  };

  return presentaciones[presentacionMaterial] || presentacionMaterial || "";
}

function obtenerNombreModeloValorizacionExpediente(expediente) {
  if (
    !expediente ||
    !expediente.modeloValorizacionId ||
    typeof buscarModeloValorizacion !== "function"
  ) {
    return "";
  }

  const modelo = buscarModeloValorizacion(expediente.modeloValorizacionId);
  return modelo ? modelo.nombre : expediente.modeloValorizacionId;
}

function mostrarHistorialExpediente(expediente) {
  const lista = document.getElementById("historialExpediente");

  if (!lista) {
    return;
  }

  lista.innerHTML = "";

  if (!expediente || !expediente.historial || expediente.historial.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Sin movimientos registrados.";
    lista.appendChild(li);
    return;
  }

  expediente.historial.forEach(item => {
    const li = document.createElement("li");
    const fecha = item.fecha ? new Date(item.fecha).toLocaleString() : "";

    li.textContent =
      fecha +
      " - " +
      (item.estado || "") +
      " - " +
      (item.descripcion || "");

    lista.appendChild(li);
  });
}

function mostrarExpedienteActual(expediente) {
  const panel = document.getElementById("panelExpediente");

  if (!panel) {
    return;
  }

  if (!expediente) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;

  document.getElementById("expedienteCodigo").textContent = expediente.codigo || "";
  document.getElementById("expedienteEstado").textContent = expediente.estado || "";
  document.getElementById("expedienteTipoMaterial").textContent =
    formatearTipoMaterialExpediente(expediente.tipoMaterial);
  document.getElementById("expedientePresentacion").textContent =
    formatearPresentacionExpediente(expediente.presentacionMaterial);
  document.getElementById("expedienteModeloValorizacion").textContent =
    obtenerNombreModeloValorizacionExpediente(expediente);
  document.getElementById("expedienteProveedor").textContent =
    obtenerNombreProveedorExpediente(expediente);
  document.getElementById("expedienteMaterial").textContent =
    obtenerNombreMaterialExpediente(expediente);
  document.getElementById("expedientePrecioCalculado").textContent =
    "Bs " + formatearMonedaExpediente(expediente.negociacion && expediente.negociacion.precioCalculadoBob);

  mostrarHistorialExpediente(expediente);
  actualizarEstadoBotonesExpediente(expediente);
}

function actualizarEstadoBotonesExpediente(expediente) {
  const btnAbrirOperacion = document.getElementById("btnAbrirOperacion");

  if (!btnAbrirOperacion || !expediente) {
    return;
  }

  btnAbrirOperacion.disabled =
    expediente.estado !== ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA;
}

function refrescarExpedienteActual() {
  mostrarExpedienteActual(expedienteActual);
}

function guardarCotizacionDesdePantalla() {
  ejecutarCalculoConcentrados();
  guardarCotizacionExpediente(expedienteActual);
  refrescarExpedienteActual();
}

function rechazarCotizacionDesdePantalla() {
  const motivo = prompt("Motivo de rechazo:");

  marcarCotizacionRechazada(expedienteActual, motivo || "");
  refrescarExpedienteActual();
}

function aceptarCotizacionDesdePantalla() {
  marcarCotizacionAceptada(expedienteActual);
  refrescarExpedienteActual();
}

function vencerCotizacionDesdePantalla() {
  marcarCotizacionVencida(expedienteActual);
  refrescarExpedienteActual();
}

function abrirOperacionDesdePantalla() {
  if (expedienteActual.estado !== ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA) {
    alert("Primero debe aceptar la cotizacion.");
    return;
  }

  abrirOperacionDesdeCotizacion(expedienteActual);
  refrescarExpedienteActual();
}

function generarProformaDesdePantalla() {
  ejecutarCalculoConcentrados();
  guardarCotizacionExpediente(expedienteActual);
  refrescarExpedienteActual();
  window.location.href = "proforma-cotizacion.html";
}

function configurarAccionesExpediente() {
  if (!expedienteActual) {
    return;
  }

  const acciones = [
    ["btnGuardarCotizacion", guardarCotizacionDesdePantalla],
    ["btnRechazarCotizacion", rechazarCotizacionDesdePantalla],
    ["btnAceptarCotizacion", aceptarCotizacionDesdePantalla],
    ["btnVencerCotizacion", vencerCotizacionDesdePantalla],
    ["btnAbrirOperacion", abrirOperacionDesdePantalla],
    ["btnGenerarProforma", generarProformaDesdePantalla]
  ];

  acciones.forEach(([id, manejador]) => {
    const boton = document.getElementById(id);

    if (boton) {
      boton.addEventListener("click", manejador);
    }
  });
}
