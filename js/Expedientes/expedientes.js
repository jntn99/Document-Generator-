const CLAVE_EXPEDIENTE_ACTUAL = "expedienteActual";
const CLAVE_HISTORIAL_EXPEDIENTES = "historialExpedientes";

function guardarExpedienteActual(expediente) {
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

function agregarHistorialExpediente(expediente, descripcion, estado) {
  if (!expediente.historial) {
    expediente.historial = [];
  }

  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: estado || expediente.estado,
    descripcion: descripcion
  });
}

function guardarYRegistrar(expediente, descripcion, estado) {
  if (estado) {
    expediente.estado = estado;
  }

  agregarHistorialExpediente(expediente, descripcion, estado);
  guardarExpedienteActual(expediente);
}

function guardarCotizacionExpediente(expediente) {
  guardarYRegistrar(
    expediente,
    "Cotizacion guardada.",
    ESTADOS_EXPEDIENTE.COTIZACION_GENERADA
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
  expediente.resultados = {
    valorBrutoBob: resultado.valorBrutoBob || 0,
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
