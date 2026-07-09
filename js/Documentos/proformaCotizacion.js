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

function crearCeldaProforma(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function limpiarTablaProforma(id) {
  const tabla = document.getElementById(id);

  if (tabla) {
    tabla.innerHTML = "";
  }

  return tabla;
}

function agregarFilaSinDatos(tabla, columnas, texto) {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");

  celda.colSpan = columnas;
  celda.textContent = texto;
  fila.appendChild(celda);
  tabla.appendChild(fila);
}

function escribirCampoOpcionalProforma(id, valor) {
  const span = document.getElementById(id);

  if (!span) {
    return;
  }

  const contenedor = span.closest("[data-opcional-proforma]");
  const texto = valor || "";

  span.textContent = texto;

  if (contenedor) {
    contenedor.style.display = texto ? "" : "none";
  }
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

function buscarMetalProforma(id) {
  if (typeof buscarMetalFisico === "function") {
    const metal = buscarMetalFisico(id);
    return metal ? metal.nombre : id || "";
  }

  return id || "";
}

function buscarPresentacionMetalProforma(id) {
  if (typeof buscarPresentacionMetal === "function") {
    const presentacion = buscarPresentacionMetal(id);
    return presentacion ? presentacion.nombre : textoPresentacion(id);
  }

  return textoPresentacion(id);
}

function textoTipoOperacion(tipoOperacion) {
  const tipos = {
    COTIZACION_PRELIMINAR: "Cotizacion preliminar",
    COMPRA_DIRECTA: "Compra directa",
    LIQUIDACION_FINAL: "Liquidacion final"
  };

  return tipos[tipoOperacion] || tipoOperacion || "";
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
    GRANALLA: "Granalla",
    GRANALLADO: "Granallado",
    POLVO: "Polvo",
    SCRAP: "Scrap",
    OTRO: "Otro"
  };

  return presentaciones[presentacionMaterial] || presentacionMaterial || "";
}

function mostrarSeccionProforma(id, visible) {
  const seccion = document.getElementById(id);

  if (seccion) {
    seccion.style.display = visible ? "" : "none";
  }
}

function buscarModeloProforma(id) {
  if (!id || typeof buscarModeloValorizacion !== "function") {
    return "";
  }

  const modelo = buscarModeloValorizacion(id);
  return modelo ? modelo.nombre : id;
}

function mostrarAnalisisProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaAnalisis");

  if (!expediente.analisis || expediente.analisis.length === 0) {
    agregarFilaSinDatos(tabla, 5, "Sin analisis registrado.");
    return;
  }

  expediente.analisis.forEach(item => {
    const elemento = buscarElementoProforma(item.elementoId);
    const contenido = (expediente.contenidoFino || []).find(
      fino => fino.elementoId === item.elementoId
    );
    const fila = document.createElement("tr");

    fila.appendChild(crearCeldaProforma(elemento ? elemento.nombre : item.elementoId));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma(item.ley, 2)));
    fila.appendChild(crearCeldaProforma(elemento ? elemento.unidadLey : ""));
    fila.appendChild(crearCeldaProforma(
      contenido
        ? formatearNumeroProforma(contenido.cantidad, 2) + " " + contenido.unidad
        : ""
    ));
    fila.appendChild(crearCeldaProforma(elemento ? elemento.unidadCotizacion : ""));
    tabla.appendChild(fila);
  });
}

function mostrarPesosProforma(expediente) {
  const pesos = expediente.pesos || {};

  document.getElementById("proformaPesoBruto").textContent =
    formatearNumeroProforma(pesos.pesoBrutoKg, 2);
  document.getElementById("proformaTara").textContent =
    formatearNumeroProforma(pesos.taraKg, 2);
  document.getElementById("proformaHumedad").textContent =
    formatearNumeroProforma(pesos.humedadKg, 2);
  document.getElementById("proformaPesoNetoSeco").textContent =
    formatearNumeroProforma(pesos.pesoNetoSecoKg, 2);
}

function mostrarCotizacionesProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaCotizaciones");
  const tipoCambio = expediente.tipoCambioUsado || {};
  const cotizaciones = expediente.cotizacionesUsadas || {};
  const analisis = expediente.analisis || [];

  if (analisis.length === 0) {
    agregarFilaSinDatos(tabla, 4, "Sin cotizaciones registradas.");
    return;
  }

  analisis.forEach(item => {
    const elemento = buscarElementoProforma(item.elementoId);
    const cotizacion = cotizaciones[item.elementoId];
    const fila = document.createElement("tr");

    fila.appendChild(crearCeldaProforma(elemento ? elemento.nombre : item.elementoId));
    fila.appendChild(crearCeldaProforma(
      cotizacion ? formatearNumeroProforma(cotizacion.valor, 2) : ""
    ));
    fila.appendChild(crearCeldaProforma(cotizacion ? cotizacion.unidad : ""));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma(tipoCambio.dolarOF, 2)));
    tabla.appendChild(fila);
  });
}

function mostrarValorBrutoProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaValorBrutoDetalle");
  const detalle = expediente.valorBruto || [];

  if (detalle.length === 0) {
    agregarFilaSinDatos(tabla, 2, "Sin valor bruto detallado.");
    return;
  }

  detalle.forEach(item => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCeldaProforma(item.nombre || item.elementoId));
    fila.appendChild(crearCeldaProforma(textoMoneda(item.valorBob)));
    tabla.appendChild(fila);
  });
}

function mostrarRegaliasProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaRegaliasDetalle");
  const detalle = expediente.regalias || [];

  if (detalle.length === 0) {
    agregarFilaSinDatos(tabla, 3, "Sin regalias detalladas.");
    return;
  }

  detalle.forEach(item => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCeldaProforma(item.nombre || item.elementoId));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma((item.alicuota || 0) * 100, 2) + "%"));
    fila.appendChild(crearCeldaProforma(textoMoneda(item.montoBob)));
    tabla.appendChild(fila);
  });
}

function mostrarDescuentosProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaDescuentosDetalle");
  const detalle = expediente.descuentos || [];

  if (detalle.length === 0) {
    agregarFilaSinDatos(tabla, 2, "Sin descuentos registrados.");
    return;
  }

  detalle.forEach(item => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCeldaProforma(item.nombre || ""));
    fila.appendChild(crearCeldaProforma(textoMoneda(item.montoBob)));
    tabla.appendChild(fila);
  });
}

function formatearLecturasXrfProforma(item) {
  const lecturas =
    item.analisisMetalurgico && Array.isArray(item.analisisMetalurgico.lecturas)
      ? item.analisisMetalurgico.lecturas
      : [];

  if (lecturas.length === 0) {
    return "";
  }

  return lecturas
    .map(lectura =>
      lectura.punto +
      ": " +
      formatearNumeroProforma(lectura.purezaPorcentaje, 2) +
      "%"
    )
    .join(" | ");
}

function mostrarItemsMetalProforma(expediente) {
  const tabla = limpiarTablaProforma("proformaItemsMetal");
  const items = expediente.itemsCompraMetal || [];

  if (!tabla) {
    return;
  }

  if (items.length === 0) {
    agregarFilaSinDatos(tabla, 9, "Sin items de metal registrados.");
    return;
  }

  items.forEach((item, indice) => {
    const fila = document.createElement("tr");
    const pureza =
      item.analisisMetalurgico && item.analisisMetalurgico.promedioPureza
        ? item.analisisMetalurgico.promedioPureza
        : item.leyPorcentaje;

    fila.appendChild(crearCeldaProforma(item.codigoLote || "ITEM-" + String(indice + 1).padStart(3, "0")));
    fila.appendChild(crearCeldaProforma(buscarMetalProforma(item.metalId)));
    fila.appendChild(crearCeldaProforma(buscarPresentacionMetalProforma(item.presentacionId)));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma(item.pesoGr, 2)));
    fila.appendChild(crearCeldaProforma(formatearLecturasXrfProforma(item)));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma(pureza, 2) + "%"));
    fila.appendChild(crearCeldaProforma(
      formatearNumeroProforma(item.cotizacion, 2) + " " + (item.unidadCotizacion || "")
    ));
    fila.appendChild(crearCeldaProforma(formatearNumeroProforma(item.tipoCambio, 2)));
    fila.appendChild(crearCeldaProforma(textoMoneda(item.totalBob)));
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
  const proveedorDatos = expediente.proveedorDatos || {};
  const proveedorNombre =
    proveedorDatos.cooperativaEmpresa ||
    buscarProveedorProforma(expediente.proveedorId);

  document.getElementById("proformaTitulo").textContent =
    expediente.tituloCotizacion || "Proforma de cotizacion";
  document.getElementById("proformaCodigo").textContent = expediente.codigo || "";
  document.getElementById("proformaFecha").textContent =
    textoFecha(expediente.fechaCreacion || expediente.fecha || new Date().toISOString());
  escribirCampoOpcionalProforma("proformaProveedor", proveedorNombre);
  escribirCampoOpcionalProforma("proformaVendedor", proveedorDatos.vendedorNombre);
  escribirCampoOpcionalProforma("proformaDocumentoIdentidad", proveedorDatos.documentoIdentidad);
  escribirCampoOpcionalProforma("proformaCredencialNumero", proveedorDatos.credencialNumero);
  escribirCampoOpcionalProforma("proformaCredencialEmisora", proveedorDatos.credencialEmisora);
  escribirCampoOpcionalProforma("proformaOrigenMaterial", proveedorDatos.origenMaterial);
  escribirCampoOpcionalProforma("proformaTipoOperacion", textoTipoOperacion(expediente.tipoOperacionComercial));
  escribirCampoOpcionalProforma("proformaPresentacion", textoPresentacion(expediente.presentacionMaterial));
  escribirCampoOpcionalProforma("proformaModeloValorizacion", buscarModeloProforma(expediente.modeloValorizacionId));
  escribirCampoOpcionalProforma("proformaMaterial", buscarMaterialProforma(expediente.materialId));
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

  if (expediente.tipoMaterial === "METAL_FISICO") {
    mostrarSeccionProforma("seccionPesosProforma", false);
    mostrarSeccionProforma("seccionAnalisisProforma", false);
    mostrarSeccionProforma("seccionCotizacionesProforma", false);
    mostrarSeccionProforma("seccionValorBrutoDetalleProforma", false);
    mostrarSeccionProforma("seccionRegaliasProforma", false);
    mostrarSeccionProforma("seccionDescuentosProforma", false);
    mostrarSeccionProforma("seccionItemsMetalProforma", true);
    mostrarItemsMetalProforma(expediente);
    return;
  }

  mostrarSeccionProforma("seccionItemsMetalProforma", false);
  mostrarPesosProforma(expediente);
  mostrarAnalisisProforma(expediente);
  mostrarCotizacionesProforma(expediente);
  mostrarValorBrutoProforma(expediente);
  mostrarRegaliasProforma(expediente);
  mostrarDescuentosProforma(expediente);
}

mostrarProformaCotizacion();
