function generarCodigoExpediente() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return "EXP-" + year + "-" + random;
}

function crearExpedienteBase() {
  return {
    codigo: generarCodigoExpediente(),
    estado: ESTADOS_EXPEDIENTE.BORRADOR,
    tipoExpediente: "COMPRA_MINERAL",

    proveedorId: "",
    compradorId: null,

    tipoMaterial: "",
    plantillaId: "",

    datosOferta: {
      pesoEstimadoKg: 0,
      condicionEntrega: "",
      ubicacionMaterial: "",
      observaciones: ""
    },

    pesos: {
      pesoBrutoKg: 0,
      taraKg: 0,
      humedadPorcentaje: 0,
      humedadKg: 0,
      pesoNetoHumedoKg: 0,
      pesoNetoSecoKg: 0
    },

    analisis: [],

    cotizacionesUsadas: {},
    tipoCambioUsado: {},

    resultados: {
      valorBrutoBob: 0,
      regaliasBob: 0,
      descuentosBob: 0,
      liquidoPagableBob: 0
    },

    negociacion: {
      precioCalculadoBob: 0,
      precioSolicitadoBob: 0,
      precioAcordadoBob: 0,
      motivoRechazo: "",
      observaciones: ""
    },

    documentos: [],
    historial: []
  };
}

function crearExpedienteDesdePlantilla(plantilla) {
  const expediente = crearExpedienteBase();

  expediente.plantillaId = plantilla.id;
  expediente.tipoMaterial = plantilla.concentradoId || plantilla.forma || "";

  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: expediente.estado,
    descripcion: "Expediente creado desde seleccion de plantilla."
  });

  return expediente;
}
