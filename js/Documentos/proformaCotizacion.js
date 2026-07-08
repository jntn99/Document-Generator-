function formatearNumeroProforma(valor, decimales) {
  return Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

function textoMoneda(valor) {
  return "Bs " + formatearNumeroProforma(valor, 2);
}

function textoFecha(fechaIso) {
  const fecha = fechaIso ? new Date(fechaIso) : new Date();

  if (Number.isNaN(fecha.getTime())) {
    return "";
  }

  return fecha.toLocaleDateString("es-ES");
}

function buscarProveedorProforma(id) {
  const proveedor = cooperativas.find(item => item.id === id);
  return proveedor ? proveedor.nombre : id || "";
}

function buscarMaterialProforma(id) {
  const material = concentrados.find(item => item.id === id);
  return material ? material.nombre : id || "";
}

function buscarElementoProforma(id) {
  return elementos.find(item => item.id === id);
}

function textoPresentacion(presentacionMaterial) {
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

function buscarModeloProforma(id) {
  if (!id || typeof buscarModeloValorizacion !== "function") {
    return "";
  }

  const modelo = buscarModeloValorizacion(id);
  return modelo ? modelo.nombre : id;
}

function mostrarAnalisisProforma(expediente) {
  const tabla = document.getElementById("proformaAnalisis");
  tabla.innerHTML = "";

  if (!expediente.analisis || expediente.analisis.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 3;
    celda.textContent = "Sin analisis registrado.";
    fila.appendChild(celda);
    tabla.appendChild(fila);
    return;
  }

  expediente.analisis.forEach(item => {
    const elemento = buscarElementoProforma(item.elementoId);
    const fila = document.createElement("tr");
    const nombre = document.createElement("td");
    const ley = document.createElement("td");
    const unidad = document.createElement("td");

    nombre.textContent = elemento ? elemento.nombre : item.elementoId;
    ley.textContent = formatearNumeroProforma(item.ley, 2);
    unidad.textContent = elemento ? elemento.unidadLey : "";

    fila.appendChild(nombre);
    fila.appendChild(ley);
    fila.appendChild(unidad);
    tabla.appendChild(fila);
  });
}

function obtenerObservaciones(expediente) {
  if (expediente.negociacion && expediente.negociacion.observaciones) {
    return expediente.negociacion.observaciones;
  }

  if (expediente.datosOferta && expediente.datosOferta.observaciones) {
    return expediente.datosOferta.observaciones;
  }

  return "Proforma referencial sujeta a verificacion final de pesos, leyes y condiciones comerciales.";
}

function mostrarProformaCotizacion() {
  const expediente = obtenerExpedienteActual();

  if (!expediente) {
    document.body.textContent = "No existe una cotizacion guardada para mostrar.";
    return;
  }

  const resultados = expediente.resultados || {};

  document.getElementById("proformaTitulo").textContent =
    expediente.tituloCotizacion || "Proforma de cotizacion";
  document.getElementById("proformaCodigo").textContent = expediente.codigo || "";
  document.getElementById("proformaFecha").textContent =
    textoFecha(expediente.fechaCreacion || expediente.fecha || new Date().toISOString());
  document.getElementById("proformaProveedor").textContent =
    buscarProveedorProforma(expediente.proveedorId);
  document.getElementById("proformaPresentacion").textContent =
    textoPresentacion(expediente.presentacionMaterial);
  document.getElementById("proformaModeloValorizacion").textContent =
    buscarModeloProforma(expediente.modeloValorizacionId);
  document.getElementById("proformaMaterial").textContent =
    buscarMaterialProforma(expediente.materialId);
  document.getElementById("proformaValorBruto").textContent =
    textoMoneda(resultados.valorBrutoBob);
  document.getElementById("proformaRegalias").textContent =
    textoMoneda(resultados.regaliasBob);
  document.getElementById("proformaDescuentos").textContent =
    textoMoneda(resultados.descuentosBob);
  document.getElementById("proformaLiquido").textContent =
    textoMoneda(resultados.liquidoPagableBob);
  document.getElementById("proformaObservaciones").textContent =
    obtenerObservaciones(expediente);

  mostrarAnalisisProforma(expediente);
}

mostrarProformaCotizacion();
