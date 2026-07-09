const CLAVE_EXPEDIENTE_ACTUAL = "expedienteActual";
const CLAVE_HISTORIAL_EXPEDIENTES = "historialExpedientes";

function asegurarAuditoria(expediente) {
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
  const usuario =
    typeof usuarioActual !== "undefined"
      ? usuarioActual
      : { id: "USR_TEMP", nombre: "Usuario temporal" };

  auditoria.actualizadoPor = usuario.id;
  auditoria.actualizadoPorNombre = usuario.nombre;
  auditoria.actualizadoEl = new Date().toISOString();
  auditoria.version = (Number(auditoria.version) || 1) + 1;
  auditoria.estadoRegistro = expediente.estado || auditoria.estadoRegistro || "BORRADOR";
}

function guardarExpedienteActual(expediente) {
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
    return JSON.parse(expedienteGuardado);
  } catch (error) {
    console.error("No se pudo leer el expediente actual:", error);
    return null;
  }
}

function obtenerHistorialExpedientes() {
  const historialGuardado = localStorage.getItem(CLAVE_HISTORIAL_EXPEDIENTES);

  if (!historialGuardado) {
    return [];
  }

  try {
    return JSON.parse(historialGuardado);
  } catch (error) {
    console.error("No se pudo leer el historial de expedientes:", error);
    return [];
  }
}

function guardarExpedienteEnHistorialLocal(expediente) {
  const historial = obtenerHistorialExpedientes();
  const indiceExpediente = historial.findIndex(
    item => item.codigo === expediente.codigo
  );
  const expedienteParaGuardar = { ...expediente };

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
  const usuario =
    typeof usuarioActual !== "undefined"
      ? usuarioActual
      : { id: "USR_TEMP", nombre: "Usuario temporal" };

  if (!historialTieneCambioReal(expediente, descripcion, estado, resumenCambio)) {
    return false;
  }

  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: estado || expediente.estado,
    descripcion: descripcion,
    creadoPor: usuario.id,
    creadoPorNombre: usuario.nombre,
    resumenCambio: resumenCambio
  });

  return true;
}

function guardarYRegistrar(expediente, descripcion, estado) {
  if (estado) {
    expediente.estado = estado;
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
  expediente.tipoCambioUsado = { ...liquidacion.tipoCambio };
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
