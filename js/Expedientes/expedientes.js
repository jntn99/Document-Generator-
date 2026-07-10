const CLAVE_EXPEDIENTE_ACTUAL = "expedienteActual";
const CLAVE_HISTORIAL_EXPEDIENTES = "historialExpedientes";

function obtenerUsuarioTemporalExpediente() {
  return typeof usuarioActual !== "undefined"
    ? usuarioActual
    : { id: "USR_TEMP", nombre: "Usuario temporal" };
}

function normalizarEstadoExpediente(estado) {
  if (estado === "OPERACION_CERRADA" || estado === "CERRADA") {
    return ESTADOS_EXPEDIENTE.COMPRA_FINALIZADA;
  }

  return estado || ESTADOS_EXPEDIENTE.BORRADOR;
}

function obtenerNombreProveedorDesdeId(proveedorId) {
  if (!proveedorId || typeof cooperativas === "undefined") {
    return "";
  }

  const proveedor = cooperativas.find(item => item.id === proveedorId);
  return proveedor ? proveedor.nombre : "";
}

function normalizarProveedorExpediente(expediente) {
  const datos = expediente.proveedorDatos || {};
  const proveedorId = expediente.proveedorId || datos.proveedorId || "";
  const nombreCatalogo = obtenerNombreProveedorDesdeId(proveedorId);
  const cooperativaEmpresa =
    datos.cooperativaEmpresa ||
    datos.nombre ||
    datos.razonSocial ||
    nombreCatalogo ||
    proveedorId ||
    "";

  expediente.proveedorId = proveedorId;
  expediente.proveedorDatos = {
    ...datos,
    proveedorId: proveedorId,
    cooperativaEmpresa: cooperativaEmpresa
  };
}

function normalizarAuditoriaExpediente(expediente) {
  const usuario = obtenerUsuarioTemporalExpediente();
  const auditoriaBase =
    typeof crearAuditoriaBase === "function"
      ? crearAuditoriaBase()
      : {
          creadoPor: usuario.id,
          creadoPorNombre: usuario.nombre,
          fechaCreacion: new Date().toISOString(),
          creadoEl: new Date().toISOString(),
          version: 1
        };
  const auditoria = { ...auditoriaBase, ...(expediente.auditoria || {}) };
  const fechaCreacion =
    expediente.fechaCreacion ||
    auditoria.fechaCreacion ||
    auditoria.creadoEl ||
    new Date().toISOString();

  expediente.fechaCreacion = fechaCreacion;
  expediente.creadoPor = expediente.creadoPor || auditoria.creadoPor || usuario.id;
  expediente.creadoPorNombre =
    expediente.creadoPorNombre || auditoria.creadoPorNombre || usuario.nombre;
  expediente.ultimoModificadoPor =
    expediente.ultimoModificadoPor ||
    auditoria.ultimoModificadoPor ||
    auditoria.actualizadoPor ||
    null;
  expediente.ultimoModificadoPorNombre =
    expediente.ultimoModificadoPorNombre ||
    auditoria.ultimoModificadoPorNombre ||
    auditoria.actualizadoPorNombre ||
    null;
  expediente.fechaUltimaModificacion =
    expediente.fechaUltimaModificacion ||
    auditoria.fechaUltimaModificacion ||
    auditoria.actualizadoEl ||
    null;
  expediente.responsableActual =
    expediente.responsableActual || auditoria.responsableActual || expediente.creadoPor;
  expediente.responsableActualNombre =
    expediente.responsableActualNombre ||
    auditoria.responsableActualNombre ||
    expediente.creadoPorNombre;
  expediente.version = Number(expediente.version || auditoria.version) || 1;

  expediente.auditoria = {
    ...auditoria,
    creadoPor: expediente.creadoPor,
    creadoPorNombre: expediente.creadoPorNombre,
    fechaCreacion: expediente.fechaCreacion,
    creadoEl: auditoria.creadoEl || expediente.fechaCreacion,
    actualizadoPor: expediente.ultimoModificadoPor,
    actualizadoPorNombre: expediente.ultimoModificadoPorNombre,
    actualizadoEl: expediente.fechaUltimaModificacion,
    ultimoModificadoPor: expediente.ultimoModificadoPor,
    ultimoModificadoPorNombre: expediente.ultimoModificadoPorNombre,
    fechaUltimaModificacion: expediente.fechaUltimaModificacion,
    responsableActual: expediente.responsableActual,
    responsableActualNombre: expediente.responsableActualNombre,
    version: expediente.version,
    estadoRegistro: expediente.estado || auditoria.estadoRegistro || "BORRADOR"
  };
}

function deduplicarMovimientosExpediente(expediente) {
  if (!Array.isArray(expediente.historial)) {
    expediente.historial = [];
    return;
  }

  const vistos = new Set();
  expediente.historial = expediente.historial.filter(movimiento => {
    const clave = [
      movimiento.fecha || "",
      normalizarEstadoExpediente(movimiento.estado),
      movimiento.descripcion || "",
      movimiento.resumenCambio || ""
    ].join("|");

    if (vistos.has(clave)) {
      return false;
    }

    vistos.add(clave);
    movimiento.estado = normalizarEstadoExpediente(movimiento.estado);
    return true;
  });
}

function normalizarExpediente(expediente) {
  if (!expediente || typeof expediente !== "object") {
    return null;
  }

  expediente.estado = normalizarEstadoExpediente(expediente.estado);
  normalizarAuditoriaExpediente(expediente);
  normalizarProveedorExpediente(expediente);
  deduplicarMovimientosExpediente(expediente);

  if (typeof normalizarTipoCambioVigente === "function") {
    expediente.tipoCambioUsado = normalizarTipoCambioVigente(expediente.tipoCambioUsado);

    if (expediente.cotizacionMetal && expediente.cotizacionMetal.tipoCambioUsado) {
      expediente.cotizacionMetal.tipoCambioUsado = normalizarTipoCambioVigente(
        expediente.cotizacionMetal.tipoCambioUsado
      );
    }
  }

  return expediente;
}

function asegurarAuditoria(expediente) {
  normalizarAuditoriaExpediente(expediente);

  if (!expediente.auditoria) {
    expediente.auditoria =
      typeof crearAuditoriaBase === "function"
        ? crearAuditoriaBase()
        : {
            creadoPor: "USR_TEMP",
            creadoPorNombre: "Usuario temporal",
            creadoEl: new Date().toISOString(),
            actualizadoPor: null,
            actualizadoPorNombre: null,
            actualizadoEl: null,
            version: 1,
            estadoRegistro: "BORRADOR"
          };
    return expediente.auditoria;
  }

  return expediente.auditoria;
}

function actualizarAuditoria(expediente) {
  const auditoria = asegurarAuditoria(expediente);
  const usuario = obtenerUsuarioTemporalExpediente();
  const fecha = new Date().toISOString();

  auditoria.actualizadoPor = usuario.id;
  auditoria.actualizadoPorNombre = usuario.nombre;
  auditoria.actualizadoEl = fecha;
  auditoria.ultimoModificadoPor = usuario.id;
  auditoria.ultimoModificadoPorNombre = usuario.nombre;
  auditoria.fechaUltimaModificacion = fecha;
  auditoria.version = (Number(auditoria.version) || 1) + 1;
  auditoria.estadoRegistro = expediente.estado || auditoria.estadoRegistro || "BORRADOR";

  expediente.ultimoModificadoPor = usuario.id;
  expediente.ultimoModificadoPorNombre = usuario.nombre;
  expediente.fechaUltimaModificacion = fecha;
  expediente.responsableActual = expediente.responsableActual || usuario.id;
  expediente.responsableActualNombre = expediente.responsableActualNombre || usuario.nombre;
  expediente.version = auditoria.version;
}

function guardarExpedienteActual(expediente) {
  normalizarExpediente(expediente);
  actualizarAuditoria(expediente);
  localStorage.setItem(CLAVE_EXPEDIENTE_ACTUAL, JSON.stringify(expediente));
  guardarExpedienteEnHistorialLocal(expediente);
}

function obtenerExpedienteActual() {
  const expedienteGuardado = localStorage.getItem(CLAVE_EXPEDIENTE_ACTUAL);

  if (!expedienteGuardado) {
    return null;
  }

  try {
    return normalizarExpediente(JSON.parse(expedienteGuardado));
  } catch (error) {
    console.error("No se pudo leer el expediente actual:", error);
    return null;
  }
}

function deduplicarHistorialExpedientes(historial) {
  const porCodigo = {};

  (Array.isArray(historial) ? historial : []).forEach(expedienteOriginal => {
    const expediente = normalizarExpediente({ ...expedienteOriginal });

    if (!expediente || !expediente.codigo) {
      return;
    }

    const existente = porCodigo[expediente.codigo];
    const fechaExpediente = new Date(
      expediente.fechaUltimaModificacion ||
      obtenerFechaUltimoMovimientoExpediente(expediente) ||
      expediente.fechaCreacion ||
      0
    ).getTime();
    const fechaExistente = existente
      ? new Date(
          existente.fechaUltimaModificacion ||
          obtenerFechaUltimoMovimientoExpediente(existente) ||
          existente.fechaCreacion ||
          0
        ).getTime()
      : -1;

    if (!existente || fechaExpediente >= fechaExistente) {
      porCodigo[expediente.codigo] = expediente;
    }
  });

  return Object.keys(porCodigo).map(codigo => porCodigo[codigo]);
}

function obtenerFechaUltimoMovimientoExpediente(expediente) {
  if (!expediente || !Array.isArray(expediente.historial) || expediente.historial.length === 0) {
    return "";
  }

  return expediente.historial[expediente.historial.length - 1].fecha || "";
}

function obtenerHistorialExpedientes() {
  const historialGuardado = localStorage.getItem(CLAVE_HISTORIAL_EXPEDIENTES);

  if (!historialGuardado) {
    return [];
  }

  try {
    const historial = JSON.parse(historialGuardado);
    const normalizado = deduplicarHistorialExpedientes(historial);

    if (JSON.stringify(historial) !== JSON.stringify(normalizado)) {
      localStorage.setItem(CLAVE_HISTORIAL_EXPEDIENTES, JSON.stringify(normalizado));
    }

    return normalizado;
  } catch (error) {
    console.error("No se pudo leer el historial de expedientes:", error);
    return [];
  }
}

function guardarExpedienteEnHistorialLocal(expediente) {
  const expedienteParaGuardar = normalizarExpediente({ ...expediente });
  const historial = deduplicarHistorialExpedientes(obtenerHistorialExpedientes());
  const indiceExpediente = historial.findIndex(
    item => item.codigo === expedienteParaGuardar.codigo
  );

  if (indiceExpediente >= 0) {
    historial[indiceExpediente] = expedienteParaGuardar;
  } else {
    historial.push(expedienteParaGuardar);
  }

  localStorage.setItem(CLAVE_HISTORIAL_EXPEDIENTES, JSON.stringify(historial));
}

function obtenerResumenCambioExpediente(expediente) {
  return JSON.stringify({
    estado: expediente.estado || "",
    proveedorId: expediente.proveedorId || "",
    proveedorDatos: expediente.proveedorDatos || null,
    tipoMaterial: expediente.tipoMaterial || "",
    tipoOperacionComercial: expediente.tipoOperacionComercial || "",
    presentacionMaterial: expediente.presentacionMaterial || "",
    materialId: expediente.materialId || "",
    modeloValorizacionId: expediente.modeloValorizacionId || "",
    resultados: expediente.resultados || null,
    negociacion: expediente.negociacion || null,
    itemsCompraMetal: expediente.itemsCompraMetal || null,
    pesos: expediente.pesos || null,
    analisis: expediente.analisis || null
  });
}

function historialTieneCambioReal(expediente, descripcion, estado, resumenCambio) {
  const historial = expediente.historial || [];
  const ultimo = historial[historial.length - 1];

  if (!ultimo) {
    return true;
  }

  return !(
    ultimo.estado === (estado || expediente.estado) &&
    ultimo.descripcion === descripcion &&
    ultimo.resumenCambio === resumenCambio
  );
}

function agregarHistorialExpediente(expediente, descripcion, estado) {
  if (!expediente.historial) {
    expediente.historial = [];
  }

  const resumenCambio = obtenerResumenCambioExpediente(expediente);
  const usuario = obtenerUsuarioTemporalExpediente();

  if (!historialTieneCambioReal(expediente, descripcion, estado, resumenCambio)) {
    return false;
  }

  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: normalizarEstadoExpediente(estado || expediente.estado),
    descripcion: descripcion,
    creadoPor: usuario.id,
    creadoPorNombre: usuario.nombre,
    resumenCambio: resumenCambio
  });

  return true;
}

function guardarYRegistrar(expediente, descripcion, estado) {
  if (estado) {
    expediente.estado = normalizarEstadoExpediente(estado);
  }

  agregarHistorialExpediente(expediente, descripcion, estado);
  guardarExpedienteActual(expediente);
}

function registrarProformaGenerada(expediente) {
  guardarYRegistrar(expediente, "Proforma generada.");
}

function guardarCotizacionExpediente(expediente) {
  guardarYRegistrar(
    expediente,
    "Cotizacion guardada.",
    ESTADOS_EXPEDIENTE.COTIZACION_GENERADA
  );
}

function marcarCotizacionEnNegociacion(expediente) {
  guardarYRegistrar(
    expediente,
    "Cotizacion en negociacion.",
    ESTADOS_EXPEDIENTE.EN_NEGOCIACION
  );
}

function actualizarExpedienteDesdeLiquidacion(expediente, liquidacion) {
  const resultado = liquidacion.resultado || {};

  expediente.plantillaId = liquidacion.plantillaId;
  expediente.proveedorId = liquidacion.cooperativaId;
  normalizarProveedorExpediente(expediente);
  expediente.materialId = liquidacion.concentradoId;

  if (!expediente.tipoMaterial) {
    expediente.tipoMaterial = "MINERAL";
  }

  if (!expediente.presentacionMaterial) {
    expediente.presentacionMaterial = "CONCENTRADO";
  }

  expediente.pesos = { ...liquidacion.pesos };
  expediente.analisis = liquidacion.analisis.map(item => ({ ...item }));
  expediente.cotizacionesUsadas = { ...liquidacion.cotizaciones };
  expediente.tipoCambioUsado =
    typeof normalizarTipoCambioVigente === "function"
      ? normalizarTipoCambioVigente(liquidacion.tipoCambio)
      : { ...liquidacion.tipoCambio };
  expediente.contenidoFino = (liquidacion.contenidoFino || []).map(item => ({ ...item }));
  expediente.valorBruto = (liquidacion.valorBruto || []).map(item => ({ ...item }));
  expediente.valorPagable = (liquidacion.valorPagable || []).map(item => ({ ...item }));
  expediente.regalias = (liquidacion.regalias || []).map(item => ({ ...item }));
  expediente.descuentos = (liquidacion.descuentos || []).map(item => ({ ...item }));
  expediente.resultados = {
    valorBrutoBob: resultado.valorBrutoBob || 0,
    valorPagableBob: resultado.valorPagableBob || 0,
    regaliasBob: resultado.totalRegaliasBob || 0,
    descuentosBob: resultado.totalDescuentosBob || 0,
    liquidoPagableBob: resultado.liquidoPagableBob || 0
  };

  if (!expediente.negociacion) {
    expediente.negociacion = {};
  }

  expediente.negociacion.precioCalculadoBob = resultado.liquidoPagableBob || 0;
}

function marcarCotizacionAceptada(expediente) {
  guardarYRegistrar(
    expediente,
    "Cotizacion aceptada.",
    ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA
  );
}

function marcarCotizacionRechazada(expediente, motivoRechazo) {
  if (!expediente.negociacion) {
    expediente.negociacion = {};
  }

  expediente.negociacion.motivoRechazo = motivoRechazo || "";
  guardarYRegistrar(
    expediente,
    "Cotizacion rechazada.",
    ESTADOS_EXPEDIENTE.COTIZACION_RECHAZADA
  );
}

function marcarCotizacionVencida(expediente) {
  guardarYRegistrar(
    expediente,
    "Cotizacion vencida.",
    ESTADOS_EXPEDIENTE.COTIZACION_VENCIDA
  );
}

function cancelarExpediente(expediente) {
  guardarYRegistrar(
    expediente,
    "Expediente cancelado.",
    ESTADOS_EXPEDIENTE.CANCELADA
  );
}

function abrirOperacionDesdeCotizacion(expediente) {
  if (expediente.estado !== ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA) {
    console.warn("La operacion solo puede abrirse desde una cotizacion aceptada.");
    return false;
  }

  guardarYRegistrar(
    expediente,
    "Operacion abierta desde cotizacion.",
    ESTADOS_EXPEDIENTE.OPERACION_ABIERTA
  );

  return true;
}

function registrarCompraFinalizada(expediente) {
  if (expediente.estado !== ESTADOS_EXPEDIENTE.OPERACION_ABIERTA) {
    console.warn("La compra solo puede finalizarse desde una operacion abierta.");
    return false;
  }

  guardarYRegistrar(
    expediente,
    "Compra finalizada.",
    ESTADOS_EXPEDIENTE.COMPRA_FINALIZADA
  );

  return true;
}
