function crearCeldaTexto(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearInputConfiguracion(tipo, valor, atributos) {
  const input = document.createElement("input");
  input.type = tipo;
  input.value = valor;

  Object.keys(atributos || {}).forEach(nombre => {
    input.setAttribute(nombre, atributos[nombre]);
  });

  return input;
}

function mostrarCotizacionesComerciales(configuracion) {
  const tabla = document.getElementById("tablaCotizacionesComerciales");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  ELEMENTOS_CONFIGURACION_COMERCIAL.forEach(elemento => {
    const cotizacion = configuracion.cotizaciones[elemento.id];
    const fila = document.createElement("tr");

    fila.dataset.elementoId = elemento.id;
    fila.appendChild(crearCeldaTexto(elemento.simbolo));

    const precio = document.createElement("td");
    precio.appendChild(crearInputConfiguracion("number", cotizacion.precio, {
      step: "0.0001",
      min: "0",
      "data-campo": "precio"
    }));
    fila.appendChild(precio);

    const unidad = document.createElement("td");
    unidad.appendChild(crearInputConfiguracion("text", cotizacion.unidad, {
      "data-campo": "unidad"
    }));
    fila.appendChild(unidad);

    const fechaVigencia = document.createElement("td");
    fechaVigencia.appendChild(crearInputConfiguracion("date", cotizacion.fechaVigencia, {
      "data-campo": "fechaVigencia"
    }));
    fila.appendChild(fechaVigencia);

    const fuente = document.createElement("td");
    fuente.appendChild(crearInputConfiguracion("text", cotizacion.fuente, {
      "data-campo": "fuente"
    }));
    fila.appendChild(fuente);

    const usuario = document.createElement("td");
    usuario.appendChild(crearInputConfiguracion("text", cotizacion.usuario, {
      "data-campo": "usuario"
    }));
    fila.appendChild(usuario);

    fila.appendChild(crearCeldaTexto(cotizacion.fechaActualizacion));
    tabla.appendChild(fila);
  });
}

function mostrarTipoCambioComercial(configuracion) {
  const fechaVigencia = document.getElementById("tipoCambioFechaVigencia");
  const oficial = document.getElementById("tipoCambioOficial");
  const comercial = document.getElementById("tipoCambioComercial");
  const fuente = document.getElementById("tipoCambioFuente");
  const usuario = document.getElementById("tipoCambioUsuario");
  const fechaHora = document.getElementById("tipoCambioFechaHoraActualizacion");
  const historial = document.getElementById("historialTipoCambio");

  if (fechaVigencia) {
    fechaVigencia.value = configuracion.tipoCambio.fechaVigencia || obtenerFechaConfiguracionComercial();
  }

  if (oficial) {
    oficial.value = configuracion.tipoCambio.oficial;
  }

  if (comercial) {
    comercial.value = configuracion.tipoCambio.comercial;
  }

  if (fuente) {
    fuente.value = configuracion.tipoCambio.fuenteObservacion || "";
  }

  if (usuario) {
    usuario.value = configuracion.tipoCambio.usuarioActualizacion || "Administrador";
  }

  if (fechaHora) {
    fechaHora.textContent = configuracion.tipoCambio.fechaHoraActualizacion || "Sin actualizacion";
  }

  if (!historial) {
    return;
  }

  historial.innerHTML = "";

  configuracion.tipoCambio.historial.forEach(item => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCeldaTexto(item.fechaVigencia || item.fechaActualizacion));
    fila.appendChild(crearCeldaTexto(item.oficial));
    fila.appendChild(crearCeldaTexto(item.comercial));
    fila.appendChild(crearCeldaTexto(item.fuenteObservacion || ""));
    fila.appendChild(crearCeldaTexto(item.usuario));
    fila.appendChild(crearCeldaTexto(item.fechaHoraActualizacion || item.fechaActualizacion));
    historial.appendChild(fila);
  });
}

function mostrarParametrosComerciales(configuracion) {
  const parametros = configuracion.parametros;
  const controles = {
    parametroMoneda: parametros.moneda,
    parametroDecimales: parametros.decimales,
    parametroToleranciaLeyes: parametros.toleranciaLeyesPorcentaje,
    parametroHumedadMaxima: parametros.humedadMaximaPorcentaje
  };

  Object.keys(controles).forEach(id => {
    const control = document.getElementById(id);

    if (control) {
      control.value = controles[id];
    }
  });
}

function mostrarRegaliasComerciales(configuracion) {
  const tabla = document.getElementById("tablaRegaliasComerciales");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  ELEMENTOS_CONFIGURACION_COMERCIAL.forEach(elemento => {
    const regalia =
      configuracion.regalias.find(item => item.elementoId === elemento.id) ||
      { alicuota: 0 };
    const fila = document.createElement("tr");
    const alicuota = document.createElement("td");

    fila.dataset.elementoId = elemento.id;
    fila.appendChild(crearCeldaTexto(elemento.simbolo));
    alicuota.appendChild(crearInputConfiguracion("number", regalia.alicuota, {
      step: "0.0001",
      min: "0",
      "data-campo": "alicuota"
    }));
    fila.appendChild(alicuota);
    tabla.appendChild(fila);
  });
}

function textoRangosPago(rangos) {
  return (rangos || [])
    .map(rango =>
      rango.desde + "-" + rango.hasta + ": " + rango.porcentajePago
    )
    .join("\n");
}

function cargarSelectClonacionTablasPago(configuracion) {
  const origen = document.getElementById("clonarTablaPagoOrigen");
  const destino = document.getElementById("clonarTablaPagoDestino");

  [origen, destino].forEach(select => {
    if (!select) {
      return;
    }

    select.innerHTML = "";

    ELEMENTOS_CONFIGURACION_COMERCIAL.forEach(elemento => {
      const option = document.createElement("option");
      option.value = elemento.id;
      option.textContent = elemento.simbolo;
      select.appendChild(option);
    });
  });

  if (origen) {
    origen.value = ELEMENTOS_CONFIGURACION_COMERCIAL[0].id;
  }

  if (destino) {
    destino.value = ELEMENTOS_CONFIGURACION_COMERCIAL[1].id;
  }
}

function crearSelectModoTablaPago(tabla) {
  const select = document.createElement("select");
  const modos = [
    { id: "FIJO", nombre: "Pago fijo" },
    { id: "RANGO_LEY", nombre: "Rango de ley" }
  ];

  select.setAttribute("data-campo", "modo");

  modos.forEach(modo => {
    const option = document.createElement("option");
    option.value = modo.id;
    option.textContent = modo.nombre;
    select.appendChild(option);
  });

  select.value = tabla.modo;
  return select;
}

function mostrarTablasPagoComerciales(configuracion) {
  const tablaVista = document.getElementById("tablaPagosComerciales");

  if (!tablaVista) {
    return;
  }

  tablaVista.innerHTML = "";
  cargarSelectClonacionTablasPago(configuracion);

  ELEMENTOS_CONFIGURACION_COMERCIAL.forEach(elemento => {
    const tabla = configuracion.tablasPago[elemento.id];
    const fila = document.createElement("tr");
    const modo = document.createElement("td");
    const fijo = document.createElement("td");
    const rangos = document.createElement("td");
    const activo = document.createElement("td");
    const acciones = document.createElement("td");
    const textarea = document.createElement("textarea");
    const checkActivo = crearInputConfiguracion("checkbox", "", {
      "data-campo": "activo"
    });
    const botonRangos = document.createElement("button");

    fila.dataset.elementoId = elemento.id;
    fila.appendChild(crearCeldaTexto(elemento.simbolo));

    modo.appendChild(crearSelectModoTablaPago(tabla));
    fila.appendChild(modo);

    fijo.appendChild(crearInputConfiguracion("number", tabla.porcentajePago, {
      step: "0.01",
      min: "0",
      max: "100",
      "data-campo": "porcentajePago"
    }));
    fila.appendChild(fijo);

    textarea.rows = 5;
    textarea.cols = 24;
    textarea.value = textoRangosPago(tabla.rangos);
    textarea.setAttribute("data-campo", "rangos");
    rangos.appendChild(textarea);
    fila.appendChild(rangos);

    checkActivo.checked = tabla.activo !== false;
    activo.appendChild(checkActivo);
    fila.appendChild(activo);

    botonRangos.type = "button";
    botonRangos.textContent = "Generar 5%";
    botonRangos.addEventListener("click", () => {
      textarea.value = textoRangosPago(crearRangosPago(0, 100, 5, 100));
      fila.querySelector("[data-campo='modo']").value = "RANGO_LEY";
    });
    acciones.appendChild(botonRangos);
    fila.appendChild(acciones);

    tablaVista.appendChild(fila);
  });
}

function crearFilaDescuento(descuento) {
  const fila = document.createElement("tr");
  const nombre = document.createElement("td");
  const porcentaje = document.createElement("td");
  const activo = document.createElement("td");
  const accion = document.createElement("td");
  const checkActivo = crearInputConfiguracion("checkbox", "", {
    "data-campo": "activo"
  });
  const botonEliminar = document.createElement("button");

  nombre.appendChild(crearInputConfiguracion("text", descuento.nombre || "", {
    "data-campo": "nombre"
  }));
  porcentaje.appendChild(crearInputConfiguracion("number", descuento.porcentaje || 0, {
    step: "0.0001",
    min: "0",
    "data-campo": "porcentaje"
  }));
  checkActivo.checked = descuento.activo !== false;
  activo.appendChild(checkActivo);
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", () => fila.remove());
  accion.appendChild(botonEliminar);

  fila.appendChild(nombre);
  fila.appendChild(porcentaje);
  fila.appendChild(activo);
  fila.appendChild(accion);

  return fila;
}

function mostrarDescuentosComerciales(configuracion) {
  const tabla = document.getElementById("tablaDescuentosComerciales");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";
  configuracion.descuentos.forEach(descuento => {
    tabla.appendChild(crearFilaDescuento(descuento));
  });
}

function mostrarConfiguracionComercial() {
  const configuracion = obtenerConfiguracionComercial();

  mostrarCotizacionesComerciales(configuracion);
  mostrarTipoCambioComercial(configuracion);
  mostrarParametrosComerciales(configuracion);
  mostrarRegaliasComerciales(configuracion);
  mostrarTablasPagoComerciales(configuracion);
  mostrarDescuentosComerciales(configuracion);
}

function leerCotizacionesComerciales() {
  const cotizaciones = {};

  document.querySelectorAll("#tablaCotizacionesComerciales tr").forEach(fila => {
    const elementoId = fila.dataset.elementoId;
    const base = crearCotizacionComercial(
      ELEMENTOS_CONFIGURACION_COMERCIAL.find(elemento => elemento.id === elementoId),
      0
    );
    const precio = Number(fila.querySelector("[data-campo='precio']").value) || 0;

    cotizaciones[elementoId] = {
      ...base,
      precio: precio,
      valor: precio,
      unidad: fila.querySelector("[data-campo='unidad']").value.trim(),
      fechaVigencia: fila.querySelector("[data-campo='fechaVigencia']").value,
      fuente: fila.querySelector("[data-campo='fuente']").value.trim(),
      usuario: fila.querySelector("[data-campo='usuario']").value.trim(),
      fechaActualizacion: obtenerFechaConfiguracionComercial()
    };
  });

  return cotizaciones;
}

function leerRegaliasComerciales() {
  return Array.from(document.querySelectorAll("#tablaRegaliasComerciales tr")).map(fila => {
    const elemento = ELEMENTOS_CONFIGURACION_COMERCIAL.find(
      item => item.id === fila.dataset.elementoId
    );

    return {
      elementoId: elemento.id,
      simbolo: elemento.simbolo,
      alicuota: validarPorcentajeVisible(
        fila.querySelector("[data-campo='alicuota']").value,
        "Alicuota " + elemento.simbolo
      )
    };
  });
}

function validarPorcentajeVisible(valor, etiqueta) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0 || numero > 100) {
    throw new Error(etiqueta + " debe estar entre 0 y 100.");
  }

  return numero;
}

function leerRangosPago(texto, elementoId) {
  const lineas = String(texto || "")
    .split(/\r?\n/)
    .map(linea => linea.trim())
    .filter(linea => linea !== "");

  return lineas.map(linea => {
    const partes = linea.split(":");
    const limites = partes[0].split("-");
    const desde = Number(limites[0]);
    const hasta = Number(limites[1]);
    const porcentajePago = Number(partes[1]);

    if (
      !Number.isFinite(desde) ||
      !Number.isFinite(hasta) ||
      hasta <= desde ||
      !Number.isFinite(porcentajePago) ||
      porcentajePago < 0 ||
      porcentajePago > 100
    ) {
      throw new Error(
        "Rango invalido en tabla de pago " +
        elementoId +
        ". Use formato 0-5: 50."
      );
    }

    return { desde: desde, hasta: hasta, porcentajePago: porcentajePago };
  });
}

function leerTablasPagoComerciales() {
  const tablasPago = {};

  document.querySelectorAll("#tablaPagosComerciales tr").forEach(fila => {
    const elementoId = fila.dataset.elementoId;
    const elemento = ELEMENTOS_CONFIGURACION_COMERCIAL.find(
      item => item.id === elementoId
    );
    const modo = fila.querySelector("[data-campo='modo']").value;
    const porcentajePago = validarPorcentajeVisible(
      fila.querySelector("[data-campo='porcentajePago']").value,
      "Porcentaje de pago " + elemento.simbolo
    );

    tablasPago[elementoId] = {
      elementoId: elementoId,
      modo: modo,
      unidadLey: elemento.unidadLey,
      porcentajePago: porcentajePago,
      rangos: leerRangosPago(
        fila.querySelector("[data-campo='rangos']").value,
        elemento.simbolo
      ),
      activo: fila.querySelector("[data-campo='activo']").checked
    };
  });

  return tablasPago;
}

function leerDescuentosComerciales() {
  return Array.from(document.querySelectorAll("#tablaDescuentosComerciales tr"))
    .map(fila => ({
      nombre: fila.querySelector("[data-campo='nombre']").value.trim(),
      porcentaje: validarPorcentajeVisible(
        fila.querySelector("[data-campo='porcentaje']").value,
        "Descuento"
      ),
      activo: fila.querySelector("[data-campo='activo']").checked
    }))
    .filter(descuento => descuento.nombre !== "");
}

function leerConfiguracionComercialDesdePantalla() {
  const configuracionActual = obtenerConfiguracionComercial();
  const fechaVigencia =
    document.getElementById("tipoCambioFechaVigencia").value ||
    obtenerFechaConfiguracionComercial();
  const oficial = Number(document.getElementById("tipoCambioOficial").value) || 0;
  const comercial = Number(document.getElementById("tipoCambioComercial").value) || 0;
  const fuenteObservacion = document.getElementById("tipoCambioFuente").value.trim();
  const usuarioTipoCambio =
    document.getElementById("tipoCambioUsuario").value.trim() || "Administrador";
  const tipoCambioCambio =
    configuracionActual.tipoCambio.oficial !== oficial ||
    configuracionActual.tipoCambio.comercial !== comercial ||
    configuracionActual.tipoCambio.fechaVigencia !== fechaVigencia ||
    configuracionActual.tipoCambio.fuenteObservacion !== fuenteObservacion;

  return {
    ...configuracionActual,
    cotizaciones: leerCotizacionesComerciales(),
    tipoCambio: {
      oficial: oficial,
      comercial: comercial,
      dolarOF: oficial,
      dolarCOM: comercial,
      fechaVigencia: fechaVigencia,
      fuenteObservacion: fuenteObservacion,
      usuarioActualizacion: usuarioTipoCambio,
      fechaHoraActualizacion: tipoCambioCambio
        ? obtenerFechaHoraConfiguracionComercial()
        : configuracionActual.tipoCambio.fechaHoraActualizacion,
      historial: registrarCambioTipoCambio(
        configuracionActual,
        oficial,
        comercial,
        usuarioTipoCambio,
        fechaVigencia,
        fuenteObservacion
      )
    },
    parametros: {
      moneda: document.getElementById("parametroMoneda").value.trim() || "BOB",
      decimales: Number(document.getElementById("parametroDecimales").value) || 2,
      toleranciaLeyesPorcentaje:
        Number(document.getElementById("parametroToleranciaLeyes").value) || 0,
      humedadMaximaPorcentaje:
        Number(document.getElementById("parametroHumedadMaxima").value) || 0
    },
    regalias: leerRegaliasComerciales(),
    tablasPago: leerTablasPagoComerciales(),
    descuentos: leerDescuentosComerciales()
  };
}

function guardarConfiguracionComercialDesdePantalla() {
  try {
    guardarConfiguracionComercial(leerConfiguracionComercialDesdePantalla());
    mostrarConfiguracionComercial();
    alert("Configuracion comercial guardada.");
  } catch (error) {
    alert(error.message);
  }
}

function configurarAccionesConfiguracionComercial() {
  const btnGuardar = document.getElementById("btnGuardarConfiguracionComercial");
  const btnRestablecer = document.getElementById("btnRestablecerConfiguracionComercial");
  const btnAgregarDescuento = document.getElementById("btnAgregarDescuentoComercial");
  const btnClonarTablaPago = document.getElementById("btnClonarTablaPago");
  const tablaDescuentos = document.getElementById("tablaDescuentosComerciales");

  if (btnGuardar) {
    btnGuardar.addEventListener("click", guardarConfiguracionComercialDesdePantalla);
  }

  if (btnRestablecer) {
    btnRestablecer.addEventListener("click", () => {
      guardarConfiguracionComercial(crearConfiguracionComercialBase());
      mostrarConfiguracionComercial();
    });
  }

  if (btnAgregarDescuento && tablaDescuentos) {
    btnAgregarDescuento.addEventListener("click", () => {
      tablaDescuentos.appendChild(
        crearFilaDescuento({ nombre: "", porcentaje: 0, activo: true })
      );
    });
  }

  if (btnClonarTablaPago) {
    btnClonarTablaPago.addEventListener("click", () => {
      const origen = document.getElementById("clonarTablaPagoOrigen").value;
      const destino = document.getElementById("clonarTablaPagoDestino").value;
      const configuracion = leerConfiguracionComercialDesdePantalla();

      if (!origen || !destino || origen === destino) {
        alert("Seleccione elementos distintos para clonar.");
        return;
      }

      configuracion.tablasPago[destino] = {
        ...configuracion.tablasPago[origen],
        elementoId: destino
      };
      guardarConfiguracionComercial(configuracion);
      mostrarConfiguracionComercial();
    });
  }
}

mostrarConfiguracionComercial();
configurarAccionesConfiguracionComercial();
