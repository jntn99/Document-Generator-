const expedienteActual = obtenerExpedienteActual();

var usuarioActual =
  typeof usuarioActual !== "undefined"
    ? usuarioActual
    : {
        id: "USR_TEMP",
        nombre: "Usuario temporal",
        rol: "OPERADOR"
      };

const ESTADOS_VERIFICACION_METAL = {
  PENDIENTE: "PENDIENTE",
  CONSISTENTE: "CONSISTENTE",
  REVISAR: "REVISAR",
  SOSPECHOSO: "SOSPECHOSO",
  REQUIERE_REFUNDICION: "REQUIERE_REFUNDICION",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO"
};

const REGLAS_XRF_METAL = {
  consistenteHasta: 3,
  revisarHasta: 8
};

var cotizacionMetales = {
  codigo: expedienteActual ? expedienteActual.codigo : "MET-0001",
  fecha: new Date().toISOString().slice(0, 10),
  expedienteId: expedienteActual ? expedienteActual.codigo : "",
  proveedorId: expedienteActual ? expedienteActual.proveedorId : "",
  tipoMaterial: "METAL_FISICO",
  presentacionMaterial: expedienteActual ? expedienteActual.presentacionMaterial : "",
  modeloValorizacionId: expedienteActual ? expedienteActual.modeloValorizacionId : "",
  plantillaId:
    (expedienteActual && expedienteActual.plantillaId) ||
    localStorage.getItem("plantillaSeleccionadaId") ||
    "",
  tipoOperacionComercial:
    (expedienteActual && expedienteActual.tipoOperacionComercial) ||
    "COTIZACION_PRELIMINAR",

  proveedor: {
    cooperativaEmpresa:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.cooperativaEmpresa) ||
      "",
    vendedorNombre:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.vendedorNombre) ||
      "",
    documentoIdentidad:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.documentoIdentidad) ||
      "",
    credencialNumero:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.credencialNumero) ||
      "",
    credencialEmisora:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.credencialEmisora) ||
      "",
    origenMaterial:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.origenMaterial) ||
      "",
    observaciones:
      (expedienteActual && expedienteActual.proveedorDatos && expedienteActual.proveedorDatos.observaciones) ||
      ""
  },

  items: [],

  tipoCambio: tipoCambio,
  cotizaciones: cotizaciones,

  totales: {
    totalUsd: 0,
    totalBob: 0,
    totalAl90Bob: 0
  },

  auditoria:
    expedienteActual && expedienteActual.auditoria
      ? { ...expedienteActual.auditoria }
      : typeof crearAuditoriaBase === "function"
        ? crearAuditoriaBase()
        : null
};

function crearRefundicionMetalBase() {
  return {
    requerida: false,
    realizada: false,
    motivo: "",
    fecha: "",
    responsableId: null,
    observaciones: ""
  };
}

function crearAnalisisMetalurgicoBase() {
  return {
    metodoDefault: "XRF_TALADRO",
    lecturas: [],
    promedioPureza: 0,
    diferenciaMaxima: 0,
    estadoVerificacion: ESTADOS_VERIFICACION_METAL.PENDIENTE,
    observaciones: "",
    registradoPor: {
      id: usuarioActual.id,
      nombre: usuarioActual.nombre
    }
  };
}

function normalizarLecturasXrf(lecturas) {
  if (!Array.isArray(lecturas)) {
    return [];
  }

  return lecturas
    .map((lectura, indice) => ({
      punto: lectura.punto || "Lectura " + (indice + 1),
      purezaPorcentaje: Number(lectura.purezaPorcentaje) || 0
    }))
    .filter(lectura => lectura.purezaPorcentaje > 0);
}

function calcularAnalisisMetalurgico(analisis) {
  const resultado = {
    ...crearAnalisisMetalurgicoBase(),
    ...(analisis || {})
  };
  const lecturas = normalizarLecturasXrf(resultado.lecturas);

  resultado.lecturas = lecturas;

  if (lecturas.length === 0) {
    resultado.promedioPureza = 0;
    resultado.diferenciaMaxima = 0;
    resultado.estadoVerificacion = ESTADOS_VERIFICACION_METAL.PENDIENTE;
    return resultado;
  }

  const valores = lecturas.map(lectura => lectura.purezaPorcentaje);
  const suma = valores.reduce((total, valor) => total + valor, 0);
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);

  resultado.promedioPureza = Math.round((suma / valores.length) * 100) / 100;
  resultado.diferenciaMaxima = Math.round((maximo - minimo) * 100) / 100;

  if (resultado.diferenciaMaxima <= REGLAS_XRF_METAL.consistenteHasta) {
    resultado.estadoVerificacion = ESTADOS_VERIFICACION_METAL.CONSISTENTE;
  } else if (resultado.diferenciaMaxima <= REGLAS_XRF_METAL.revisarHasta) {
    resultado.estadoVerificacion = ESTADOS_VERIFICACION_METAL.REVISAR;
  } else {
    resultado.estadoVerificacion = ESTADOS_VERIFICACION_METAL.SOSPECHOSO;
  }

  return resultado;
}

function normalizarItemMetal(item) {
  return {
    ...item,
    analisisMetalurgico: calcularAnalisisMetalurgico(item.analisisMetalurgico),
    refundicion: {
      ...crearRefundicionMetalBase(),
      ...(item.refundicion || {})
    }
  };
}

function crearItemMetalBase() {
  const plantilla = cotizacionMetales.plantillaId
    ? buscarPlantilla(cotizacionMetales.plantillaId)
    : null;
  const metalInicial =
    (plantilla && plantilla.metalId && buscarMetalFisico(plantilla.metalId)) ||
    metalesFisicos.find(metal => metal.activo);
  const presentacionInicial =
    presentacionesMetal.find(item => item.id === cotizacionMetales.presentacionMaterial) ||
    (
      plantilla &&
      plantilla.presentacionesPermitidas &&
      presentacionesMetal.find(item => item.id === plantilla.presentacionesPermitidas[0])
    ) ||
    presentacionesMetal.find(item => item.activo);
  const presentacionesPermitidas =
    typeof obtenerPresentacionesPermitidasMetal === "function" && metalInicial
      ? obtenerPresentacionesPermitidasMetal(metalInicial.id)
      : presentacionesMetal.filter(item => item.activo);
  const presentacionValida =
    presentacionInicial &&
    presentacionesPermitidas.some(item => item.id === presentacionInicial.id)
      ? presentacionInicial
      : presentacionesPermitidas[0];

  return {
    metalId: metalInicial ? metalInicial.id : "",
    presentacionId: presentacionValida ? presentacionValida.id : "",
    codigoLote: "",
    pesoGr: 0,
    leyPorcentaje: 0,
    finosGr: 0,
    cotizacion: 0,
    unidadCotizacion: metalInicial ? metalInicial.unidadCotizacion : "",
    tipoCambio: cotizacionMetales.tipoCambio.dolarOF || 0,
    descuentoPorcentaje: presentacionValida ? presentacionValida.descuentoDefault : 0,
    valorUsd: 0,
    valorBob: 0,
    totalUsd: 0,
    totalBob: 0,
    totalAl90Bob: 0,
    observaciones: "",
    analisisMetalurgico: crearAnalisisMetalurgicoBase(),
    refundicion: crearRefundicionMetalBase()
  };
}

function generarCodigoTemporalItemMetal(indice) {
  return "ITEM-" + String(indice + 1).padStart(3, "0");
}

function asegurarItemsMetalIniciales() {
  if (expedienteActual && Array.isArray(expedienteActual.itemsCompraMetal)) {
    cotizacionMetales.items = expedienteActual.itemsCompraMetal.map(normalizarItemMetal);
  }

  if (cotizacionMetales.items.length === 0) {
    cotizacionMetales.items.push(crearItemMetalBase());
  }
}

function buscarCotizacionMetal(metalId) {
  if (typeof obtenerCotizacionPorElemento === "function") {
    return obtenerCotizacionPorElemento(metalId);
  }

  if (!cotizacionMetales || !cotizacionMetales.cotizaciones) {
    return null;
  }

  return cotizacionMetales.cotizaciones[metalId] || null;
}

asegurarItemsMetalIniciales();

console.log("Datos base de metales fisicos:", cotizacionMetales);
