var liquidacion = {
  codigo: "EM-CN5001",
  fecha: "2026-07-06",

  plantillaId: localStorage.getItem("plantillaSeleccionadaId") || "PLANTILLA_CONC_PB",

  cooperativaId: "COOP001",
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
  return liquidacion.cotizaciones[elementoId];
}

const plantillaActual = buscarPlantilla(liquidacion.plantillaId);

if (plantillaActual) {
  liquidacion.concentradoId = plantillaActual.concentradoId;
  liquidacion.elementosPrincipales = plantillaActual.elementosPrincipales || [];
  liquidacion.elementosOpcionales = plantillaActual.elementosOpcionales || [];

  liquidacion.analisis = liquidacion.elementosPrincipales.map(elementoId => {
    return {
      elementoId: elementoId,
      ley: elementoId === "PB" ? 70 : 7
    };
  });
}

console.log("Plantilla aplicada a la liquidación:", plantillaActual);
console.log("Datos base de liquidación:", liquidacion);
