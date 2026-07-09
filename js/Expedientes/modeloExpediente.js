var usuarioActual =
  typeof usuarioActual !== "undefined"
    ? usuarioActual
    : {
        id: "USR_TEMP",
        nombre: "Usuario temporal",
        rol: "OPERADOR"
      };

function crearAuditoriaBase() {
  return {
    creadoPor: usuarioActual.id,
    creadoPorNombre: usuarioActual.nombre,
    creadoEl: new Date().toISOString(),
    actualizadoPor: null,
    actualizadoPorNombre: null,
    actualizadoEl: null,
    version: 1,
    estadoRegistro: "BORRADOR"
  };
}

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
    fechaCreacion: new Date().toISOString(),
    creadoPor: usuarioActual.id,
    creadoPorNombre: usuarioActual.nombre,
    tituloCotizacion: "",
    estado: ESTADOS_EXPEDIENTE.BORRADOR,
    tipoExpediente: "COMPRA_MINERAL",

    proveedorId: "",
    compradorId: null,

    tipoMaterial: "",
    presentacionMaterial: "",
    materialId: "",
    modeloValorizacionId: "",
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
    historial: [],
    auditoria: crearAuditoriaBase()
  };
}

function obtenerTipoMaterialDesdePlantilla(plantilla) {
  if (plantilla.tipoOperacion === "METAL_FISICO") {
    return "METAL_FISICO";
  }

  return "MINERAL";
}

function crearExpedienteDesdePlantilla(plantilla, opciones) {
  const datosSeleccionados = opciones || {};
  const expediente = crearExpedienteBase();

  expediente.plantillaId = plantilla.id;
  expediente.tipoMaterial =
    datosSeleccionados.tipoMaterial || obtenerTipoMaterialDesdePlantilla(plantilla);
  expediente.presentacionMaterial = datosSeleccionados.presentacionMaterial || "";
  expediente.modeloValorizacionId = datosSeleccionados.modeloValorizacionId || "";
  expediente.materialId = plantilla.concentradoId || plantilla.elementos?.[0] || "";

  expediente.historial.push({
    fecha: new Date().toISOString(),
    estado: expediente.estado,
    descripcion: "Expediente creado.",
    creadoPor: usuarioActual.id,
    creadoPorNombre: usuarioActual.nombre,
    resumenCambio: "CREACION:" + expediente.codigo
  });

  return expediente;
}
