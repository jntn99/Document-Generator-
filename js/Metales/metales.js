console.log("Modulo principal de metales fisicos iniciado");

function actualizarAuditoriaCotizacionMetales() {
  const usuario =
    typeof usuarioActual !== "undefined"
      ? usuarioActual
      : { id: "USR_TEMP", nombre: "Usuario temporal" };

  if (!cotizacionMetales.auditoria) {
    cotizacionMetales.auditoria =
      typeof crearAuditoriaBase === "function"
        ? crearAuditoriaBase()
        : {
            creadoPor: usuario.id,
            creadoPorNombre: usuario.nombre,
            creadoEl: new Date().toISOString(),
            actualizadoPor: null,
            actualizadoPorNombre: null,
            actualizadoEl: null,
            version: 1,
            estadoRegistro: "BORRADOR"
          };
  }

  cotizacionMetales.auditoria.actualizadoPor = usuario.id;
  cotizacionMetales.auditoria.actualizadoPorNombre = usuario.nombre;
  cotizacionMetales.auditoria.actualizadoEl = new Date().toISOString();
  cotizacionMetales.auditoria.version =
    (Number(cotizacionMetales.auditoria.version) || 1) + 1;
  cotizacionMetales.auditoria.estadoRegistro = "COTIZACION_GENERADA";
}

function guardarMetalesEnExpediente() {
  if (!expedienteActual) {
    return;
  }

  actualizarAuditoriaCotizacionMetales();
  cotizacionMetales.tipoCambio =
    typeof normalizarTipoCambioVigente === "function"
      ? normalizarTipoCambioVigente(cotizacionMetales.tipoCambio)
      : cotizacionMetales.tipoCambio;

  expedienteActual.tipoMaterial = "METAL_FISICO";
  expedienteActual.tipoOperacionComercial = cotizacionMetales.tipoOperacionComercial;
  expedienteActual.proveedorId = cotizacionMetales.proveedorId || "";
  expedienteActual.proveedorDatos = { ...cotizacionMetales.proveedor };
  if (typeof normalizarProveedorExpediente === "function") {
    normalizarProveedorExpediente(expedienteActual);
  }
  expedienteActual.itemsCompraMetal = cotizacionMetales.items.map(item => ({ ...item }));
  expedienteActual.tipoCambioUsado = { ...cotizacionMetales.tipoCambio };
  expedienteActual.cotizacionMetal = {
    codigo: cotizacionMetales.codigo,
    fecha: cotizacionMetales.fecha,
    tipoOperacionComercial: cotizacionMetales.tipoOperacionComercial,
    items: cotizacionMetales.items.map(item => ({ ...item })),
    tipoCambioUsado: { ...cotizacionMetales.tipoCambio },
    totales: { ...cotizacionMetales.totales },
    auditoria: cotizacionMetales.auditoria ? { ...cotizacionMetales.auditoria } : null
  };
  expedienteActual.resultados = {
    valorBrutoBob: cotizacionMetales.totales.totalBob,
    valorPagableBob: cotizacionMetales.totales.totalBob,
    regaliasBob: 0,
    descuentosBob: 0,
    liquidoPagableBob: cotizacionMetales.totales.totalBob,
    totalUsd: cotizacionMetales.totales.totalUsd,
    totalAl90Bob: cotizacionMetales.totales.totalAl90Bob
  };

  if (!expedienteActual.negociacion) {
    expedienteActual.negociacion = {};
  }

  expedienteActual.negociacion.precioCalculadoBob = cotizacionMetales.totales.totalBob;
  guardarExpedienteActual(expedienteActual);
}

function ejecutarCalculoMetales() {
  leerFormularioMetales();
  leerDatosProveedorMetal();
  leerTipoCambioMetal();

  const validacion = validarCotizacionMetales();

  if (!validacion.valido) {
    alert(validacion.errores.join("\n"));
    throw new Error("Cotizacion de metales invalida.");
  }

  calcularMetales();
  guardarMetalesEnExpediente();
  mostrarMetales();
}

function configurarAccionesMetales() {
  const btnAgregar = document.getElementById("btnAgregarItemMetal");
  const btnCalcular = document.getElementById("btnCalcularMetales");
  const btnGuardar = document.getElementById("btnGuardarMetales");
  const btnProforma = document.getElementById("btnGenerarProformaMetales");
  const btnNegociacion = document.getElementById("btnNegociacionMetales");
  const btnAceptar = document.getElementById("btnAceptarMetales");
  const btnRechazar = document.getElementById("btnRechazarMetales");
  const btnVencer = document.getElementById("btnVencerMetales");
  const btnAbrirOperacion = document.getElementById("btnAbrirOperacionMetales");
  const btnFinalizarCompra = document.getElementById("btnFinalizarCompraMetales");

  if (btnAgregar) {
    btnAgregar.addEventListener("click", agregarItemMetal);
  }

  if (btnCalcular) {
    btnCalcular.addEventListener("click", ejecutarCalculoMetales);
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", function () {
      ejecutarCalculoMetales();
      if (expedienteActual && typeof guardarCotizacionExpediente === "function") {
        guardarCotizacionExpediente(expedienteActual);
      }
    });
  }

  if (btnProforma) {
    btnProforma.addEventListener("click", function () {
      ejecutarCalculoMetales();
      if (expedienteActual && typeof registrarProformaGenerada === "function") {
        registrarProformaGenerada(expedienteActual);
      }
      window.location.href = "proforma-cotizacion.html";
    });
  }

  if (btnNegociacion) {
    btnNegociacion.addEventListener("click", function () {
      if (typeof marcarCotizacionEnNegociacion === "function") {
        marcarCotizacionEnNegociacion(expedienteActual);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  if (btnAceptar) {
    btnAceptar.addEventListener("click", function () {
      if (typeof marcarCotizacionAceptada === "function") {
        marcarCotizacionAceptada(expedienteActual);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  if (btnRechazar) {
    btnRechazar.addEventListener("click", function () {
      const motivo = prompt("Motivo del rechazo:", "") || "";

      if (typeof marcarCotizacionRechazada === "function") {
        marcarCotizacionRechazada(expedienteActual, motivo);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  if (btnVencer) {
    btnVencer.addEventListener("click", function () {
      if (typeof marcarCotizacionVencida === "function") {
        marcarCotizacionVencida(expedienteActual);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  if (btnAbrirOperacion) {
    btnAbrirOperacion.addEventListener("click", function () {
      if (typeof abrirOperacionDesdeCotizacion === "function") {
        abrirOperacionDesdeCotizacion(expedienteActual);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", function () {
      if (typeof registrarCompraFinalizada === "function") {
        registrarCompraFinalizada(expedienteActual);
      }
      bloquearEdicionMetalesSegunEstado();
      actualizarEstadoAccionesMetales();
    });
  }

  ["tipoCambioOfMetal", "tipoCambioComMetal"].forEach(id => {
    const control = document.getElementById(id);

    if (control) {
      control.addEventListener("change", function () {
        leerTipoCambioMetal();
        mostrarMetales();
      });
    }
  });
}

function actualizarEstadoAccionesMetales() {
  if (!expedienteActual) {
    return;
  }

  const estado = expedienteActual.estado || ESTADOS_EXPEDIENTE.BORRADOR;
  const accionesPorEstado = {
    [ESTADOS_EXPEDIENTE.BORRADOR]: [
      "btnAgregarItemMetal",
      "btnCalcularMetales",
      "btnGuardarMetales",
      "btnGenerarProformaMetales"
    ],
    [ESTADOS_EXPEDIENTE.COTIZACION_GENERADA]: [
      "btnNegociacionMetales",
      "btnAceptarMetales",
      "btnRechazarMetales",
      "btnVencerMetales",
      "btnGenerarProformaMetales"
    ],
    [ESTADOS_EXPEDIENTE.EN_NEGOCIACION]: [
      "btnAceptarMetales",
      "btnRechazarMetales",
      "btnVencerMetales",
      "btnGenerarProformaMetales"
    ],
    [ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA]: ["btnAbrirOperacionMetales"],
    [ESTADOS_EXPEDIENTE.OPERACION_ABIERTA]: ["btnFinalizarCompraMetales"],
    [ESTADOS_EXPEDIENTE.COTIZACION_RECHAZADA]: ["btnGenerarProformaMetales"],
    [ESTADOS_EXPEDIENTE.COTIZACION_VENCIDA]: ["btnGenerarProformaMetales"],
    [ESTADOS_EXPEDIENTE.COMPRA_FINALIZADA]: ["btnGenerarProformaMetales"]
  };
  const accionesVisibles = accionesPorEstado[estado] || [];

  [
    "btnAgregarItemMetal",
    "btnCalcularMetales",
    "btnGuardarMetales",
    "btnGenerarProformaMetales",
    "btnNegociacionMetales",
    "btnAceptarMetales",
    "btnRechazarMetales",
    "btnVencerMetales",
    "btnAbrirOperacionMetales",
    "btnFinalizarCompraMetales"
  ].forEach(id => {
    const boton = document.getElementById(id);

    if (boton) {
      const visible = accionesVisibles.includes(id);
      boton.hidden = !visible;
      boton.disabled = !visible;
    }
  });
}

function bloquearEdicionMetalesSegunEstado() {
  if (!expedienteActual) {
    return;
  }

  const estado = expedienteActual.estado || ESTADOS_EXPEDIENTE.BORRADOR;
  const edicionPermitida = estado === ESTADOS_EXPEDIENTE.BORRADOR;

  document
    .querySelectorAll(
      "#tablaItemsMetal input, #tablaItemsMetal select, #tablaItemsMetal textarea, " +
      "#tipoOperacionMetal, #proveedorNombreMetal, #vendedorNombreMetal, " +
      "#documentoIdentidadMetal, #credencialNumeroMetal, #credencialEmisoraMetal, " +
      "#origenMaterialMetal, #observacionesProveedorMetal, " +
      "#tipoCambioOfMetal, #tipoCambioComMetal"
    )
    .forEach(control => {
      control.disabled = !edicionPermitida;
    });

  ["btnAgregarItemMetal", "btnCalcularMetales", "btnGuardarMetales"].forEach(id => {
    const boton = document.getElementById(id);

    if (boton) {
      boton.disabled = !edicionPermitida;
    }
  });
}

generarFormularioMetales();
cargarAutocompletadoCooperativasMetal();
escribirDatosProveedorMetal();
escribirTipoCambioMetal();
configurarAccionesMetales();
mostrarMetales();
bloquearEdicionMetalesSegunEstado();
actualizarEstadoAccionesMetales();
