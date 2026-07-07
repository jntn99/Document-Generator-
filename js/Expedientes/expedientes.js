const CLAVE_EXPEDIENTE_ACTUAL = "expedienteActual";

function guardarExpedienteActual(expediente) {
  localStorage.setItem(CLAVE_EXPEDIENTE_ACTUAL, JSON.stringify(expediente));
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

function agregarHistorialExpediente(expediente, descripcion, estado) {
  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: estado || expediente.estado,
    descripcion: descripcion
  });
}

function actualizarExpedienteDesdeLiquidacion(expediente, liquidacion) {
  expediente.plantillaId = liquidacion.plantillaId;
  expediente.proveedorId = liquidacion.cooperativaId;
  expediente.tipoMaterial = liquidacion.concentradoId;
  expediente.pesos = { ...liquidacion.pesos };
  expediente.analisis = liquidacion.analisis.map(item => ({ ...item }));
  expediente.cotizacionesUsadas = { ...liquidacion.cotizaciones };
  expediente.tipoCambioUsado = { ...liquidacion.tipoCambio };
  expediente.resultados = {
    valorBrutoBob: liquidacion.resultado.valorBrutoBob || 0,
    regaliasBob: liquidacion.resultado.totalRegaliasBob || 0,
    descuentosBob: liquidacion.resultado.totalDescuentosBob || 0,
    liquidoPagableBob: liquidacion.resultado.liquidoPagableBob || 0
  };
  expediente.negociacion.precioCalculadoBob =
    liquidacion.resultado.liquidoPagableBob || 0;
}

function marcarCotizacionAceptada(expediente) {
  expediente.estado = ESTADOS_EXPEDIENTE.COTIZACION_ACEPTADA;
  agregarHistorialExpediente(expediente, "Cotizacion aceptada.");
}

function marcarCotizacionRechazada(expediente, motivoRechazo) {
  expediente.estado = ESTADOS_EXPEDIENTE.COTIZACION_RECHAZADA;
  expediente.negociacion.motivoRechazo = motivoRechazo || "";
  agregarHistorialExpediente(expediente, "Cotizacion rechazada.");
}

function marcarCotizacionVencida(expediente) {
  expediente.estado = ESTADOS_EXPEDIENTE.COTIZACION_VENCIDA;
  agregarHistorialExpediente(expediente, "Cotizacion vencida.");
}

function abrirOperacionDesdeCotizacion(expediente) {
  expediente.estado = ESTADOS_EXPEDIENTE.OPERACION_ABIERTA;
  agregarHistorialExpediente(expediente, "Operacion abierta desde cotizacion.");
}
