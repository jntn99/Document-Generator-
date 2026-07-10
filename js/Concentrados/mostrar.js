function formatearNumeroRegional(valor, decimales) {
  return Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

function formatearMonedaRegional(valor) {
  return "Bs " + formatearNumeroRegional(valor, 2);
}

var usuarioActual =
  typeof window !== "undefined" && window.usuarioActual
    ? window.usuarioActual
    : { rol: "OPERADOR" };

function puedeVerDetalleInterno() {
  return usuarioActual && usuarioActual.rol === "ADMIN";
}

function mostrarBloqueInterno(idLista, visible) {
  const lista = document.getElementById(idLista);

  if (!lista) {
    return;
  }

  lista.hidden = !visible;

  if (lista.previousElementSibling) {
    lista.previousElementSibling.hidden = !visible;
  }
}

function aplicarVisibilidadDetalleInterno() {
  mostrarBloqueInterno("valorPagable", puedeVerDetalleInterno());
}

function obtenerTituloCotizacionAutomatico() {
  const simbolos = liquidacion.analisis
    .map(item => buscarElemento(item.elementoId))
    .filter(elemento => elemento)
    .map(elemento => elemento.simbolo);

  return "Cotizacion " + simbolos.join("-");
}

function mostrarTituloCotizacion() {
  const inputTitulo = document.getElementById("tituloCotizacion");

  if (!inputTitulo) {
    return;
  }

  if (expedienteActual && !expedienteActual.tituloCotizacion) {
    expedienteActual.tituloCotizacion = obtenerTituloCotizacionAutomatico();
    guardarExpedienteActual(expedienteActual);
  }

  inputTitulo.value =
    (expedienteActual && expedienteActual.tituloCotizacion) ||
    obtenerTituloCotizacionAutomatico();
}

function cargarAutocompletadoProveedores() {
  const lista = document.getElementById("listaProveedores");

  if (!lista) {
    return;
  }

  lista.innerHTML = "";

  cooperativas.forEach(cooperativa => {
    const option = document.createElement("option");
    option.value = cooperativa.nombre;
    lista.appendChild(option);
  });
}

function actualizarProveedorDesdeInput() {
  const inputProveedor = document.getElementById("inputProveedor");

  if (!inputProveedor) {
    return;
  }

  const texto = inputProveedor.value.trim().toLowerCase();
  const proveedor = cooperativas.find(
    item =>
      item.nombre.toLowerCase() === texto ||
      item.id.toLowerCase() === texto
  );

  if (!proveedor) {
    return;
  }

  liquidacion.cooperativaId = proveedor.id;

  if (expedienteActual) {
    expedienteActual.proveedorId = proveedor.id;
    expedienteActual.proveedorDatos = {
      ...(expedienteActual.proveedorDatos || {}),
      proveedorId: proveedor.id,
      cooperativaEmpresa: proveedor.nombre
    };
    if (typeof normalizarProveedorExpediente === "function") {
      normalizarProveedorExpediente(expedienteActual);
    }
    guardarExpedienteActual(expedienteActual);
    mostrarExpedienteActual(expedienteActual);
  }
}

function configurarProveedorEditable() {
  const inputProveedor = document.getElementById("inputProveedor");

  if (!inputProveedor) {
    return;
  }

  cargarAutocompletadoProveedores();
  inputProveedor.addEventListener("change", actualizarProveedorDesdeInput);
}

function configurarTituloEditable() {
  const inputTitulo = document.getElementById("tituloCotizacion");

  if (!inputTitulo) {
    return;
  }

  inputTitulo.addEventListener("change", function () {
    if (!expedienteActual) {
      return;
    }

    expedienteActual.tituloCotizacion = inputTitulo.value.trim();
    guardarExpedienteActual(expedienteActual);
  });
}

function mostrarDatosGenerales() {
  const cooperativa = buscarCooperativa(liquidacion.cooperativaId);
  const concentrado = buscarConcentrado(liquidacion.concentradoId);
  const nombreProveedor =
    (cooperativa && cooperativa.nombre) ||
    (expedienteActual &&
      expedienteActual.proveedorDatos &&
      expedienteActual.proveedorDatos.cooperativaEmpresa) ||
    liquidacion.cooperativaId ||
    "";

  mostrarTituloCotizacion();
  document.getElementById("codigo").textContent = liquidacion.codigo;
  document.getElementById("cooperativa").textContent = nombreProveedor;
  document.getElementById("inputProveedor").value = nombreProveedor;
  document.getElementById("concentrado").textContent =
    concentrado ? concentrado.nombre : liquidacion.concentradoId || "";
}

function mostrarPesos() {
  document.getElementById("pesoBruto").textContent =
    formatearNumeroRegional(liquidacion.pesos.pesoBrutoKg, 2);

  document.getElementById("tara").textContent =
    formatearNumeroRegional(liquidacion.pesos.taraKg, 2);

  document.getElementById("humedadKg").textContent =
    formatearNumeroRegional(liquidacion.pesos.humedadKg, 2);

  document.getElementById("pesoNetoSeco").textContent =
    formatearNumeroRegional(liquidacion.pesos.pesoNetoSecoKg, 2);
}

function mostrarElementosDelConcentrado() {
  const lista = document.getElementById("listaElementos");

  lista.innerHTML = "";

  liquidacion.analisis.forEach(analisisElemento => {
    const elemento = buscarElemento(analisisElemento.elementoId);
    const contenido = liquidacion.contenidoFino.find(
      item => item.elementoId === analisisElemento.elementoId
    );

    if (!elemento) {
      return;
    }

    const li = document.createElement("li");

    li.textContent =
      elemento.nombre +
      " (" +
      elemento.simbolo +
      ") - Ley: " +
      formatearNumeroRegional(analisisElemento.ley, 2) +
      " " +
      elemento.unidadLey +
      " - Fino: " +
      formatearNumeroRegional(contenido ? contenido.cantidad : 0, 2) +
      " " +
      (contenido ? contenido.unidad : elemento.unidadContenido) +
      " - Cotizacion en " +
      elemento.unidadCotizacion;

    lista.appendChild(li);
  });
}

function mostrarContenidoFino() {
  const lista = document.getElementById("contenidoFino");

  lista.innerHTML = "";

  liquidacion.contenidoFino.forEach(item => {
    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): " +
      formatearNumeroRegional(item.cantidad, 2) +
      " " +
      item.unidad;

    lista.appendChild(li);
  });
}

function mostrarCotizaciones() {
  const lista = document.getElementById("cotizaciones");

  lista.innerHTML = "";

  liquidacion.analisis.forEach(analisisElemento => {
    const elemento = buscarElemento(analisisElemento.elementoId);
    const cotizacion = liquidacion.cotizaciones[analisisElemento.elementoId];

    if (!elemento) {
      return;
    }

    const li = document.createElement("li");

    if (!cotizacion) {
      li.textContent =
        "Advertencia: falta cotizacion para " +
        elemento.nombre +
        " (" +
        elemento.simbolo +
        ").";
      console.warn("Falta cotizacion para:", elemento.id);
    } else {
      li.textContent =
        elemento.nombre +
        " (" +
        elemento.simbolo +
        "): " +
        formatearNumeroRegional(cotizacion.valor, 2) +
        " " +
        cotizacion.unidad +
        " - TC: " +
        formatearNumeroRegional(
          liquidacion.tipoCambio.vigente || liquidacion.tipoCambio.dolarOF,
          2
        );
    }

    lista.appendChild(li);
  });

  const dolarOF = document.createElement("li");
  dolarOF.textContent =
    "Tipo de cambio vigente: " +
    formatearNumeroRegional(
      liquidacion.tipoCambio.vigente || liquidacion.tipoCambio.dolarOF,
      2
    );

  const dolarCOM = document.createElement("li");
  dolarCOM.textContent =
    "Compatibilidad T/C: " +
    formatearNumeroRegional(
      liquidacion.tipoCambio.dolarCOM || liquidacion.tipoCambio.vigente,
      2
    );

  lista.appendChild(dolarOF);
  lista.appendChild(dolarCOM);
}

function mostrarValorBruto() {
  const lista = document.getElementById("valorBruto");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.valorBruto.forEach(item => {
    total += item.valorBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): " +
      formatearMonedaRegional(item.valorBob);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total valor bruto: " + formatearMonedaRegional(total);

  lista.appendChild(totalLi);
}

function mostrarValorPagable() {
  const lista = document.getElementById("valorPagable");

  if (!lista) {
    return;
  }

  lista.innerHTML = "";

  let total = 0;

  (liquidacion.valorPagable || []).forEach(item => {
    total += item.valorPagableBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): " +
      formatearMonedaRegional(item.valorPagableBob) +
      " (" +
      formatearNumeroRegional(item.porcentajePago * 100, 2) +
      "%)";

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total valor pagable: " + formatearMonedaRegional(total);

  lista.appendChild(totalLi);
}

function mostrarRegalias() {
  const lista = document.getElementById("regalias");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.regalias.forEach(item => {
    total += item.montoBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): " +
      formatearNumeroRegional(item.alicuota * 100, 2) +
      "% - " +
      formatearMonedaRegional(item.montoBob);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total regalias: " + formatearMonedaRegional(total);

  lista.appendChild(totalLi);
}

function mostrarDescuentos() {
  const lista = document.getElementById("descuentos");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.descuentos.forEach(item => {
    total += item.montoBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      ": " +
      formatearMonedaRegional(item.montoBob);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total descuentos: " + formatearMonedaRegional(total);

  lista.appendChild(totalLi);
}

function mostrarResultadoFinal() {
  const lista = document.getElementById("resultadoFinal");

  lista.innerHTML = "";

  const liquido = document.createElement("li");
  liquido.textContent =
    "Liquido pagable: " + formatearMonedaRegional(liquidacion.resultado.liquidoPagableBob);

  const valorBruto = document.createElement("li");
  valorBruto.textContent =
    "Valor bruto: " + formatearMonedaRegional(liquidacion.resultado.valorBrutoBob);

  const regalias = document.createElement("li");
  regalias.textContent =
    "Regalias: " + formatearMonedaRegional(liquidacion.resultado.totalRegaliasBob);

  const descuentos = document.createElement("li");
  descuentos.textContent =
    "Descuentos: " + formatearMonedaRegional(liquidacion.resultado.totalDescuentosBob);

  lista.appendChild(valorBruto);
  lista.appendChild(regalias);
  lista.appendChild(descuentos);
  lista.appendChild(liquido);
  aplicarVisibilidadDetalleInterno();
}
