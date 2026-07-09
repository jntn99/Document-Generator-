const expedienteActual = obtenerExpedienteActual();

var liquidacion = {
  codigo: expedienteActual ? expedienteActual.codigo : "EM-CN5001",
  fecha: "2026-07-06",

  plantillaId:
    (expedienteActual && expedienteActual.plantillaId) ||
    localStorage.getItem("plantillaSeleccionadaId") ||
    "PLANTILLA_CONC_PB",

  cooperativaId:
    (expedienteActual && expedienteActual.proveedorId) ||
    "COOP001",
  concentradoId: null,
  elementosPrincipales: [],
  elementosOpcionales: [],

  pesos: {
    pesoBrutoKg: 20000,
    taraKg: 0,
    humedadPorcentaje: 0.001,
    humedadKg: 0,
    pesoNetoHumedoKg: 0,
    pesoNetoSecoKg: 0
  },

  analisis: [],

  cotizaciones: cotizaciones,
  tipoCambio: tipoCambio,

  contenidoFino: [],
  valorBruto: [],
  valorPagable: [],
  regalias: [],
  descuentos: [],
  resultado: {}
};

function buscarCooperativa(id) {
  return cooperativas.find(cooperativa => cooperativa.id === id);
}

function buscarConcentrado(id) {
  return concentrados.find(concentrado => concentrado.id === id);
}

function buscarElemento(id) {
  return elementos.find(elemento => elemento.id === id);
}

function buscarCotizacion(elementoId) {
  if (typeof obtenerCotizacionPorElemento === "function") {
    return obtenerCotizacionPorElemento(elementoId);
  }

  return liquidacion.cotizaciones[elementoId];
}

const plantillaActual = buscarPlantilla(liquidacion.plantillaId);
const modeloValorizacionActual =
  expedienteActual && expedienteActual.modeloValorizacionId
    ? buscarModeloValorizacion(expedienteActual.modeloValorizacionId)
    : buscarModeloValorizacionPorPlantilla(liquidacion.plantillaId);

if (plantillaActual) {
  liquidacion.concentradoId = plantillaActual.concentradoId;
  liquidacion.elementosPrincipales =
    obtenerElementosPrincipalesModelo(modeloValorizacionActual, plantillaActual);
  liquidacion.elementosOpcionales =
    obtenerElementosOpcionalesModelo(modeloValorizacionActual, plantillaActual);

  liquidacion.analisis = liquidacion.elementosPrincipales.map(elementoId => {
    return {
      elementoId: elementoId,
      ley: elementoId === "PB" ? 70 : 7
    };
  });
}

if (expedienteActual) {
  const materialExpediente =
    expedienteActual.materialId ||
    (
      expedienteActual.tipoMaterial !== "MINERAL" &&
      expedienteActual.tipoMaterial !== "METAL_FISICO"
        ? expedienteActual.tipoMaterial
        : ""
    );

  if (materialExpediente) {
    liquidacion.concentradoId = materialExpediente;
  }

  if (expedienteActual.pesos && expedienteActual.pesos.pesoBrutoKg > 0) {
    liquidacion.pesos = { ...liquidacion.pesos, ...expedienteActual.pesos };
  }

  if (expedienteActual.analisis && expedienteActual.analisis.length > 0) {
    liquidacion.analisis = expedienteActual.analisis.map(item => ({ ...item }));
  }
}

console.log("Plantilla aplicada a la liquidacion:", plantillaActual);
console.log("Modelo de valorizacion aplicado:", modeloValorizacionActual);
console.log("Expediente comercial actual:", expedienteActual);
console.log("Datos base de liquidacion:", liquidacion);
