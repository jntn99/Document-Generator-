var usuarioActual =
  typeof usuarioActual !== "undefined"
    ? usuarioActual
    : {
        id: "USR_TEMP",
        nombre: "Usuario temporal",
        rol: "OPERADOR"
      };

function crearAuditoriaBase() {
  const fecha = new Date().toISOString();

  return {
    creadoPor: usuarioActual.id,
    creadoPorNombre: usuarioActual.nombre,
    fechaCreacion: fecha,
    creadoEl: fecha,
    actualizadoPor: null,
    actualizadoPorNombre: null,
    actualizadoEl: null,
    ultimoModificadoPor: null,
    ultimoModificadoPorNombre: null,
    fechaUltimaModificacion: null,
    responsableActual: usuarioActual.id,
    responsableActualNombre: usuarioActual.nombre,
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

function codigoExpedienteExiste(codigo) {
  if (
    typeof localStorage === "undefined" ||
    typeof CLAVE_HISTORIAL_EXPEDIENTES === "undefined"
  ) {
    return false;
  }

  try {
    const historial = JSON.parse(
      localStorage.getItem(CLAVE_HISTORIAL_EXPEDIENTES) || "[]"
    );

    return Array.isArray(historial) && historial.some(item => item.codigo === codigo);
  } catch (error) {
    console.warn("No se pudo verificar unicidad del codigo:", error);
    return false;
  }
}

function generarCodigoExpedienteUnico() {
  let codigo = generarCodigoExpediente();
  let intentos = 0;

  while (codigoExpedienteExiste(codigo) && intentos < 20) {
    codigo = generarCodigoExpediente();
    intentos += 1;
  }

  if (codigoExpedienteExiste(codigo)) {
    codigo =
      "EXP-" +
      new Date().getFullYear() +
      "-" +
      String(Date.now()).slice(-8);
  }

  return codigo;
}

function crearExpedienteBase() {
  const auditoria = crearAuditoriaBase();

  return {
    codigo: generarCodigoExpedienteUnico(),
    fechaCreacion: auditoria.fechaCreacion,
    creadoPor: usuarioActual.id,
    creadoPorNombre: usuarioActual.nombre,
    ultimoModificadoPor: null,
    ultimoModificadoPorNombre: null,
    fechaUltimaModificacion: null,
    responsableActual: usuarioActual.id,
    responsableActualNombre: usuarioActual.nombre,
    version: 1,
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
    auditoria: auditoria
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
