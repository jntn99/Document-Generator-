function crearOpcionMetal(metal, seleccionado) {
  const option = document.createElement("option");
  option.value = metal.id;
  option.textContent = metal.nombre + " (" + metal.simbolo + ")";
  option.selected = metal.id === seleccionado;
  return option;
}

function crearOpcionPresentacionMetal(presentacion, seleccionado) {
  const option = document.createElement("option");
  option.value = presentacion.id;
  option.textContent = presentacion.nombre;
  option.selected = presentacion.id === seleccionado;
  return option;
}

function crearInputItemMetal(tipo, valor, campo, step) {
  const input = document.createElement("input");
  input.type = tipo;
  input.value = valor;
  input.dataset.campo = campo;

  if (step) {
    input.step = step;
  }

  return input;
}

function crearTextareaItemMetal(valor, campo, placeholder) {
  const textarea = document.createElement("textarea");
  textarea.value = valor || "";
  textarea.dataset.campo = campo;
  textarea.placeholder = placeholder || "";
  textarea.rows = 3;
  textarea.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      textarea.value = "";
      evento.preventDefault();
    }
  });
  return textarea;
}

function serializarLecturasXrf(lecturas) {
  return normalizarLecturasXrf(lecturas)
    .map(lectura => lectura.purezaPorcentaje)
    .join("\n");
}

function parsearLecturasXrf(texto) {
  return (texto || "")
    .split(/\r?\n/)
    .map((linea, indice) => {
      const partes = linea.split(":");
      const valorTexto = partes.length > 1 ? partes.slice(1).join(":") : partes[0];
      const punto = partes.length > 1 ? partes[0].trim() : "Lectura " + (indice + 1);
      const purezaPorcentaje = Number(String(valorTexto).replace(",", ".").trim());

      return {
        punto: punto || "Lectura " + (indice + 1),
        purezaPorcentaje: purezaPorcentaje
      };
    })
    .filter(lectura => lectura.purezaPorcentaje > 0);
}

function crearFilaFormularioMetal(item, indice) {
  item.analisisMetalurgico = calcularAnalisisMetalurgico(item.analisisMetalurgico);
  const obtenerPresentacionesFila = () =>
    typeof obtenerPresentacionesPermitidasMetal === "function"
      ? obtenerPresentacionesPermitidasMetal(metalSelect.value || item.metalId)
      : presentacionesMetal.filter(presentacion => presentacion.activo);
  const recargarPresentacionesFila = () => {
    const presentacionActual = presentacionSelect.value || item.presentacionId;
    const presentaciones = obtenerPresentacionesFila();

    presentacionSelect.innerHTML = "";
    presentaciones.forEach(presentacion => {
      presentacionSelect.appendChild(
        crearOpcionPresentacionMetal(presentacion, presentacionActual)
      );
    });

    if (!presentaciones.some(presentacion => presentacion.id === presentacionSelect.value)) {
      presentacionSelect.value = presentaciones[0] ? presentaciones[0].id : "";
    }
  };

  const fila = document.createElement("tr");
  const numero = document.createElement("td");
  const metalTd = document.createElement("td");
  const presentacionTd = document.createElement("td");
  const codigoLoteTd = document.createElement("td");
  const pesoTd = document.createElement("td");
  const purezaCalculadaTd = document.createElement("td");
  const descuentoTd = document.createElement("td");
  const observacionesTd = document.createElement("td");
  const lecturasTd = document.createElement("td");
  const resumenXrfTd = document.createElement("td");
  const estadoXrfTd = document.createElement("td");
  const accionesTd = document.createElement("td");
  const metalSelect = document.createElement("select");
  const presentacionSelect = document.createElement("select");
  const botonEliminar = document.createElement("button");

  fila.dataset.indice = indice;
  numero.textContent = indice + 1;

  metalSelect.dataset.campo = "metalId";
  metalesFisicos.filter(metal => metal.activo).forEach(metal => {
    metalSelect.appendChild(crearOpcionMetal(metal, item.metalId));
  });
  metalTd.appendChild(metalSelect);

  presentacionSelect.dataset.campo = "presentacionId";
  recargarPresentacionesFila();
  presentacionSelect.addEventListener("change", function () {
    const presentacion = buscarPresentacionMetal(presentacionSelect.value);
    const descuento = fila.querySelector("[data-campo='descuentoPorcentaje']");

    if (presentacion && descuento) {
      descuento.value = presentacion.descuentoDefault;
    }
  });
  presentacionTd.appendChild(presentacionSelect);
  metalSelect.addEventListener("change", function () {
    recargarPresentacionesFila();
    const presentacion = buscarPresentacionMetal(presentacionSelect.value);
    const descuento = fila.querySelector("[data-campo='descuentoPorcentaje']");

    if (presentacion && descuento) {
      descuento.value = presentacion.descuentoDefault;
    }
  });

  codigoLoteTd.textContent = generarCodigoTemporalItemMetal(indice);
  pesoTd.appendChild(crearInputItemMetal("number", item.pesoGr, "pesoGr", "0.01"));
  purezaCalculadaTd.textContent =
    item.analisisMetalurgico.promedioPureza > 0
      ? item.analisisMetalurgico.promedioPureza.toFixed(2) + " %"
      : "Pendiente XRF";
  descuentoTd.appendChild(
    crearInputItemMetal("number", item.descuentoPorcentaje, "descuentoPorcentaje", "0.01")
  );
  observacionesTd.appendChild(
    crearInputItemMetal("text", item.observaciones || "", "observaciones")
  );
  lecturasTd.appendChild(
    crearTextareaItemMetal(
      serializarLecturasXrf(item.analisisMetalurgico.lecturas),
      "lecturasXrf",
      "95\n92\n94"
    )
  );
  const actualizarResumenXrfFila = () => {
    const controlLecturas = fila.querySelector("[data-campo='lecturasXrf']");
    const analisis = calcularAnalisisMetalurgico({
      ...crearAnalisisMetalurgicoBase(),
      lecturas: parsearLecturasXrf(controlLecturas.value)
    });

    resumenXrfTd.textContent = analisis.lecturas
      .map((lectura, lecturaIndice) =>
        "Lectura " + (lecturaIndice + 1) + ": " + lectura.purezaPorcentaje + "%"
      )
      .join(" | ");
    purezaCalculadaTd.textContent =
      analisis.promedioPureza > 0
        ? analisis.promedioPureza.toFixed(2) + " %"
        : "Pendiente XRF";
    estadoXrfTd.textContent =
      "Promedio: " +
      analisis.promedioPureza.toFixed(2) +
      "% / Diferencia maxima: " +
      analisis.diferenciaMaxima.toFixed(2) +
      "% / Estado: " +
      analisis.estadoVerificacion;
  };
  const controlLecturasXrf = lecturasTd.querySelector("[data-campo='lecturasXrf']");
  controlLecturasXrf.addEventListener("input", actualizarResumenXrfFila);
  controlLecturasXrf.addEventListener("keyup", function () {
    leerFormularioMetales();
    const validacion = validarCotizacionMetales();

    if (validacion.valido) {
      calcularMetales();
      mostrarMetales();
    }
  });
  const botonEliminarLectura = document.createElement("button");
  botonEliminarLectura.type = "button";
  botonEliminarLectura.textContent = "Quitar ultima lectura";
  botonEliminarLectura.addEventListener("click", function () {
    const controlLecturas = fila.querySelector("[data-campo='lecturasXrf']");
    const lineas = controlLecturas.value.split(/\r?\n/).filter(linea => linea.trim());
    lineas.pop();
    controlLecturas.value = lineas.join("\n");
    actualizarResumenXrfFila();
  });
  lecturasTd.appendChild(botonEliminarLectura);
  actualizarResumenXrfFila();

  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", function () {
    leerFormularioMetales();
    cotizacionMetales.items.splice(indice, 1);
    generarFormularioMetales();
  });
  accionesTd.appendChild(botonEliminar);

  fila.appendChild(numero);
  fila.appendChild(metalTd);
  fila.appendChild(presentacionTd);
  fila.appendChild(codigoLoteTd);
  fila.appendChild(pesoTd);
  fila.appendChild(purezaCalculadaTd);
  fila.appendChild(descuentoTd);
  fila.appendChild(observacionesTd);
  fila.appendChild(lecturasTd);
  fila.appendChild(resumenXrfTd);
  fila.appendChild(estadoXrfTd);
  fila.appendChild(accionesTd);

  return fila;
}

function generarFormularioMetales() {
  const tabla = document.getElementById("tablaItemsMetal");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";
  cotizacionMetales.items.forEach((item, indice) => {
    tabla.appendChild(crearFilaFormularioMetal(item, indice));
  });
}

function cargarAutocompletadoCooperativasMetal() {
  const lista = document.getElementById("listaCooperativasMetal");

  if (!lista || typeof cooperativas === "undefined") {
    return;
  }

  lista.innerHTML = "";

  cooperativas.forEach(cooperativa => {
    const option = document.createElement("option");
    option.value = cooperativa.nombre;
    lista.appendChild(option);
  });
}

function escribirDatosProveedorMetal() {
  const proveedor = cotizacionMetales.proveedor || {};
  const campos = {
    tipoOperacionMetal: cotizacionMetales.tipoOperacionComercial,
    proveedorNombreMetal: proveedor.cooperativaEmpresa,
    vendedorNombreMetal: proveedor.vendedorNombre,
    documentoIdentidadMetal: proveedor.documentoIdentidad,
    credencialNumeroMetal: proveedor.credencialNumero,
    credencialEmisoraMetal: proveedor.credencialEmisora,
    origenMaterialMetal: proveedor.origenMaterial,
    observacionesProveedorMetal: proveedor.observaciones
  };

  Object.keys(campos).forEach(id => {
    const control = document.getElementById(id);

    if (control) {
      control.value = campos[id] || "";
    }
  });
}

function escribirTipoCambioMetal() {
  const of = document.getElementById("tipoCambioOfMetal");
  const com = document.getElementById("tipoCambioComMetal");
  const vigencia = document.getElementById("tipoCambioVigenciaMetal");
  const fuente = document.getElementById("tipoCambioFuenteMetal");

  if (of) {
    of.value = cotizacionMetales.tipoCambio.dolarOF || cotizacionMetales.tipoCambio.oficial || 0;
  }

  if (com) {
    com.value = cotizacionMetales.tipoCambio.dolarCOM || cotizacionMetales.tipoCambio.comercial || 0;
  }

  if (vigencia) {
    vigencia.textContent = cotizacionMetales.tipoCambio.fechaVigencia || "Sin fecha";
  }

  if (fuente) {
    fuente.textContent = cotizacionMetales.tipoCambio.fuenteObservacion || "Configuracion Comercial";
  }
}

function leerTipoCambioMetal() {
  const of = document.getElementById("tipoCambioOfMetal");
  const com = document.getElementById("tipoCambioComMetal");

  if (of) {
    const valorOf = Number(of.value) || 0;
    cotizacionMetales.tipoCambio.oficial = valorOf;
    cotizacionMetales.tipoCambio.dolarOF = valorOf;
  }

  if (com) {
    const valorCom = Number(com.value) || 0;
    cotizacionMetales.tipoCambio.comercial = valorCom;
    cotizacionMetales.tipoCambio.dolarCOM = valorCom;
  }

  cotizacionMetales.tipoCambio.modificadoTemporalmente = true;
}

function leerDatosProveedorMetal() {
  const obtener = id => {
    const control = document.getElementById(id);
    return control ? control.value.trim() : "";
  };

  cotizacionMetales.tipoOperacionComercial =
    obtener("tipoOperacionMetal") || "COTIZACION_PRELIMINAR";
  cotizacionMetales.proveedor = {
    cooperativaEmpresa: obtener("proveedorNombreMetal"),
    vendedorNombre: obtener("vendedorNombreMetal"),
    documentoIdentidad: obtener("documentoIdentidadMetal"),
    credencialNumero: obtener("credencialNumeroMetal"),
    credencialEmisora: obtener("credencialEmisoraMetal"),
    origenMaterial: obtener("origenMaterialMetal"),
    observaciones: obtener("observacionesProveedorMetal"),
    adjuntos: []
  };

  if (typeof cooperativas !== "undefined") {
    const texto = cotizacionMetales.proveedor.cooperativaEmpresa.toLowerCase();
    const cooperativa = cooperativas.find(item =>
      item.nombre.toLowerCase() === texto ||
      item.id.toLowerCase() === texto
    );

    if (cooperativa) {
      cotizacionMetales.proveedorId = cooperativa.id;
    }
  }
}

function leerFormularioMetales() {
  const filas = document.querySelectorAll("#tablaItemsMetal tr");

  cotizacionMetales.items = Array.from(filas).map((fila, indice) => {
    const analisisMetalurgico = calcularAnalisisMetalurgico({
      ...crearAnalisisMetalurgicoBase(),
      lecturas: parsearLecturasXrf(fila.querySelector("[data-campo='lecturasXrf']").value)
    });

    return {
      metalId: fila.querySelector("[data-campo='metalId']").value,
      presentacionId: fila.querySelector("[data-campo='presentacionId']").value,
      codigoLote: generarCodigoTemporalItemMetal(indice),
      pesoGr: Number(fila.querySelector("[data-campo='pesoGr']").value) || 0,
      leyPorcentaje: analisisMetalurgico.promedioPureza,
      descuentoPorcentaje:
        Number(fila.querySelector("[data-campo='descuentoPorcentaje']").value) || 0,
      finosGr: 0,
      cotizacion: 0,
      unidadCotizacion: "",
      tipoCambio: cotizacionMetales.tipoCambio.dolarOF || 0,
      valorUsd: 0,
      valorBob: 0,
      totalUsd: 0,
      totalBob: 0,
      totalAl90Bob: 0,
      observaciones: fila.querySelector("[data-campo='observaciones']").value.trim(),
      analisisMetalurgico: analisisMetalurgico,
      refundicion: crearRefundicionMetalBase()
    };
  });
}

function agregarItemMetal() {
  leerFormularioMetales();
  leerDatosProveedorMetal();
  leerTipoCambioMetal();
  cotizacionMetales.items.push(crearItemMetalBase());
  generarFormularioMetales();
  escribirDatosProveedorMetal();
  escribirTipoCambioMetal();
}
