const CONFIGURACION_COMERCIAL_STORAGE_KEY = "configuracionComercial";

const ELEMENTOS_CONFIGURACION_COMERCIAL = [
  { id: "PB", nombre: "Plomo", simbolo: "Pb", unidad: "L.F.", unidadLey: "%" },
  { id: "AG", nombre: "Plata", simbolo: "Ag", unidad: "O.T.", unidadLey: "DM" },
  { id: "AU", nombre: "Oro", simbolo: "Au", unidad: "O.T.", unidadLey: "g/TM" },
  { id: "ZN", nombre: "Zinc", simbolo: "Zn", unidad: "L.F.", unidadLey: "%" },
  { id: "CU", nombre: "Cobre", simbolo: "Cu", unidad: "L.F.", unidadLey: "%" },
  { id: "SB", nombre: "Antimonio", simbolo: "Sb", unidad: "TM", unidadLey: "%" },
  { id: "SN", nombre: "Estano", simbolo: "Sn", unidad: "TM", unidadLey: "%" },
  { id: "TA", nombre: "Tantalio", simbolo: "Ta", unidad: "TM", unidadLey: "ppm" }
];

function obtenerFechaConfiguracionComercial() {
  return new Date().toISOString().slice(0, 10);
}

function obtenerFechaHoraConfiguracionComercial() {
  return new Date().toISOString();
}

function crearCotizacionComercial(elemento, precio) {
  const fecha = obtenerFechaConfiguracionComercial();

  return {
    elementoId: elemento.id,
    nombre: elemento.nombre,
    simbolo: elemento.simbolo,
    precio: precio || 0,
    valor: precio || 0,
    unidad: elemento.unidad,
    activa: true,
    fechaVigencia: fecha,
    fuente: "Manual",
    usuario: "Administrador",
    fechaActualizacion: fecha
  };
}

function crearConfiguracionComercialBase() {
  const cotizaciones = {};
  const tablasPago = {};

  ELEMENTOS_CONFIGURACION_COMERCIAL.forEach(elemento => {
    cotizaciones[elemento.id] = crearCotizacionComercial(elemento, 0);
    tablasPago[elemento.id] = crearTablaPagoFijo(elemento.id, elemento.unidadLey || "%", 100);
  });

  return {
    version: 2,
    cotizaciones: cotizaciones,
    tipoCambio: {
      vigente: 0,
      oficial: 0,
      comercial: 0,
      dolarOF: 0,
      dolarCOM: 0,
      fechaVigencia: obtenerFechaConfiguracionComercial(),
      fuenteObservacion: "",
      usuarioActualizacion: "Administrador",
      fechaHoraActualizacion: "",
      historial: []
    },
    parametros: {
      moneda: "BOB",
      decimales: 2,
      toleranciaLeyesPorcentaje: 0.5,
      humedadMaximaPorcentaje: 100
    },
    regalias: ELEMENTOS_CONFIGURACION_COMERCIAL.map(elemento => ({
      elementoId: elemento.id,
      simbolo: elemento.simbolo,
      alicuota: 0
    })),
    tablasPago: tablasPago,
    descuentos: [],
    fechaActualizacion: obtenerFechaConfiguracionComercial(),
    historialConfiguracion: []
  };
}

function obtenerUsuarioConfiguracionComercial() {
  return typeof usuarioActual !== "undefined"
    ? usuarioActual
    : { id: "USR_TEMP", nombre: "Usuario temporal" };
}

function crearResumenConfiguracionComercial(configuracion) {
  return JSON.stringify({
    cotizaciones: configuracion.cotizaciones,
    tipoCambio: configuracion.tipoCambio,
    parametros: configuracion.parametros,
    regalias: configuracion.regalias,
    tablasPago: configuracion.tablasPago,
    descuentos: configuracion.descuentos
  });
}

function registrarHistorialConfiguracionComercial(configuracion, configuracionAnterior) {
  const resumenCambio = crearResumenConfiguracionComercial(configuracion);
  const historial = Array.isArray(configuracion.historialConfiguracion)
    ? [...configuracion.historialConfiguracion]
    : [];
  const ultimo = historial[historial.length - 1];

  if (ultimo && ultimo.resumenCambio === resumenCambio) {
    configuracion.historialConfiguracion = historial;
    return;
  }

  if (
    configuracionAnterior &&
    crearResumenConfiguracionComercial(configuracionAnterior) === resumenCambio
  ) {
    configuracion.historialConfiguracion = historial;
    return;
  }

  const usuario = obtenerUsuarioConfiguracionComercial();
  historial.push({
    fecha: new Date().toISOString(),
    descripcion: "Configuracion modificada.",
    creadoPor: usuario.id,
    creadoPorNombre: usuario.nombre,
    resumenCambio: resumenCambio
  });
  configuracion.historialConfiguracion = historial;
}

function crearRangosPago(inicio, fin, paso, porcentajePago) {
  const rangos = [];
  const desdeInicial = normalizarNumeroConfiguracion(inicio, 0);
  const hastaFinal = normalizarNumeroConfiguracion(fin, 100);
  const pasoRango = normalizarNumeroConfiguracion(paso, 5);
  const pago = normalizarNumeroConfiguracion(porcentajePago, 100);

  for (let desde = desdeInicial; desde < hastaFinal; desde += pasoRango) {
    rangos.push({
      desde: desde,
      hasta: Math.min(desde + pasoRango, hastaFinal),
      porcentajePago: pago
    });
  }

  return rangos;
}

function crearTablaPagoFijo(elementoId, unidadLey, porcentajePago) {
  return {
    elementoId: elementoId,
    modo: "FIJO",
    unidadLey: unidadLey || "%",
    porcentajePago: normalizarNumeroConfiguracion(porcentajePago, 100),
    rangos: [],
    activo: true
  };
}

function crearTablaPagoRangos(elementoId, unidadLey, rangos) {
  return {
    elementoId: elementoId,
    modo: "RANGO_LEY",
    unidadLey: unidadLey || "%",
    porcentajePago: 100,
    rangos: Array.isArray(rangos) ? rangos : crearRangosPago(0, 100, 5, 100),
    activo: true
  };
}

function normalizarNumeroConfiguracion(valor, respaldo) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : respaldo;
}

function obtenerValorTipoCambioVigente(tipoCambio) {
  const origen = tipoCambio || {};
  const candidatos = [
    origen.vigente,
    origen.dolarOF,
    origen.oficial,
    origen.dolarCOM,
    origen.comercial
  ];

  for (let indice = 0; indice < candidatos.length; indice += 1) {
    const valor = Number(candidatos[indice]);

    if (Number.isFinite(valor) && valor > 0) {
      return valor;
    }
  }

  return 0;
}

function normalizarTipoCambioVigente(tipoCambio) {
  const origen = tipoCambio || {};
  const vigente = obtenerValorTipoCambioVigente(origen);

  return {
    ...origen,
    vigente: vigente,
    oficial: vigente,
    comercial: vigente,
    dolarOF: vigente,
    dolarCOM: vigente,
    fechaVigencia: origen.fechaVigencia || obtenerFechaConfiguracionComercial(),
    fuenteObservacion: origen.fuenteObservacion || "",
    usuarioActualizacion: origen.usuarioActualizacion || "Administrador",
    fechaHoraActualizacion: origen.fechaHoraActualizacion || "",
    historial: Array.isArray(origen.historial) ? origen.historial : []
  };
}

function normalizarConfiguracionComercial(configuracion) {
  const base = crearConfiguracionComercialBase();
  const origen = configuracion || {};
  const normalizada = {
    ...base,
    ...origen,
    cotizaciones: { ...base.cotizaciones, ...(origen.cotizaciones || {}) },
    tipoCambio: { ...base.tipoCambio, ...(origen.tipoCambio || {}) },
    parametros: { ...base.parametros, ...(origen.parametros || {}) },
    regalias: Array.isArray(origen.regalias) ? origen.regalias : base.regalias,
    tablasPago: { ...base.tablasPago, ...(origen.tablasPago || {}) },
    descuentos: Array.isArray(origen.descuentos) ? origen.descuentos : base.descuentos
  };

  Object.keys(normalizada.cotizaciones).forEach(elementoId => {
    const cotizacion = normalizada.cotizaciones[elementoId];
    const respaldoCotizacion =
      base.cotizaciones[elementoId] ||
      {
        unidad: cotizacion.unidad || "TM",
        nombre: cotizacion.nombre || elementoId,
        simbolo: cotizacion.simbolo || elementoId
      };
    const precio = normalizarNumeroConfiguracion(
      cotizacion.precio !== undefined ? cotizacion.precio : cotizacion.valor,
      0
    );

    normalizada.cotizaciones[elementoId] = {
      ...cotizacion,
      precio: precio,
      valor: precio,
      unidad: cotizacion.unidad || respaldoCotizacion.unidad,
      activa: cotizacion.activa === false ? false : true,
      fuente: cotizacion.fuente || "Manual",
      usuario: cotizacion.usuario || "Administrador",
      fechaVigencia: cotizacion.fechaVigencia || obtenerFechaConfiguracionComercial(),
      fechaActualizacion:
        cotizacion.fechaActualizacion || obtenerFechaConfiguracionComercial()
    };
  });

  normalizada.tipoCambio = normalizarTipoCambioVigente(normalizada.tipoCambio);

  Object.keys(normalizada.tablasPago).forEach(elementoId => {
    normalizada.tablasPago[elementoId] = normalizarTablaPago(
      elementoId,
      normalizada.tablasPago[elementoId],
      base.tablasPago[elementoId]
    );
  });

  const debeMigrarPorcentajes = !origen.version || origen.version < 2;

  normalizada.version = 2;

  normalizada.regalias = normalizada.regalias.map(regalia => ({
    ...regalia,
    alicuota: normalizarPorcentajeVisibleGuardado(regalia.alicuota, debeMigrarPorcentajes)
  }));

  normalizada.descuentos = normalizada.descuentos.map(descuento => ({
    ...descuento,
    porcentaje: normalizarPorcentajeVisibleGuardado(descuento.porcentaje, debeMigrarPorcentajes)
  }));

  return normalizada;
}

function limitarPorcentajeVisible(valor) {
  const numero = normalizarNumeroConfiguracion(valor, 0);
  return Math.min(Math.max(numero, 0), 100);
}

function normalizarPorcentajeVisibleGuardado(valor, migrarDecimal) {
  const numero = normalizarNumeroConfiguracion(valor, 0);

  if (migrarDecimal && numero > 0 && numero <= 1) {
    return limitarPorcentajeVisible(numero * 100);
  }

  return limitarPorcentajeVisible(numero);
}

function normalizarTablaPago(elementoId, tabla, respaldo) {
  const base = respaldo || crearTablaPagoFijo(elementoId, "%", 100);
  const normalizada = {
    ...base,
    ...(tabla || {}),
    elementoId: elementoId,
    modo: tabla && tabla.modo === "RANGO_LEY" ? "RANGO_LEY" : "FIJO",
    activo: tabla && tabla.activo === false ? false : true
  };

  normalizada.porcentajePago = limitarPorcentajeVisible(normalizada.porcentajePago);
  normalizada.rangos = Array.isArray(normalizada.rangos)
    ? normalizada.rangos.map(rango => ({
      desde: normalizarNumeroConfiguracion(rango.desde, 0),
      hasta: normalizarNumeroConfiguracion(rango.hasta, 0),
      porcentajePago: limitarPorcentajeVisible(rango.porcentajePago)
    }))
    : [];

  return normalizada;
}

function obtenerConfiguracionComercial() {
  const guardada = localStorage.getItem(CONFIGURACION_COMERCIAL_STORAGE_KEY);

  if (!guardada) {
    const base = crearConfiguracionComercialBase();
    return guardarConfiguracionComercial(base);
  }

  try {
    return normalizarConfiguracionComercial(JSON.parse(guardada));
  } catch (error) {
    console.warn("No se pudo leer la configuracion comercial guardada:", error);
    return crearConfiguracionComercialBase();
  }
}

function guardarConfiguracionComercial(configuracion) {
  const configuracionAnteriorTexto = localStorage.getItem(CONFIGURACION_COMERCIAL_STORAGE_KEY);
  const configuracionAnterior = configuracionAnteriorTexto
    ? normalizarConfiguracionComercial(JSON.parse(configuracionAnteriorTexto))
    : null;
  const normalizada = normalizarConfiguracionComercial({
    ...configuracion,
    fechaActualizacion: obtenerFechaConfiguracionComercial()
  });

  registrarHistorialConfiguracionComercial(normalizada, configuracionAnterior);

  localStorage.setItem(
    CONFIGURACION_COMERCIAL_STORAGE_KEY,
    JSON.stringify(normalizada)
  );

  return normalizada;
}

function obtenerCotizacionesConfiguracion() {
  return obtenerConfiguracionComercial().cotizaciones;
}

function obtenerTipoCambioConfiguracion() {
  return obtenerConfiguracionComercial().tipoCambio;
}

function validarTipoCambioVigente(tipoCambioEvaluado) {
  const tipoCambioActual = normalizarTipoCambioVigente(
    tipoCambioEvaluado || obtenerTipoCambioConfiguracion()
  );
  const hoy = obtenerFechaConfiguracionComercial();
  const vigente = Number(tipoCambioActual.vigente) || 0;

  return {
    valido:
      tipoCambioActual.fechaVigencia === hoy &&
      vigente > 0,
    mensaje: "Debe configurar el tipo de cambio vigente antes de calcular."
  };
}

function obtenerParametrosConfiguracionComercial() {
  return obtenerConfiguracionComercial().parametros;
}

function obtenerAlicuotaRegaliaConfiguracion(elementoId) {
  const configuracion = obtenerConfiguracionComercial();
  const regalia = configuracion.regalias.find(item => item.elementoId === elementoId);
  return regalia ? limitarPorcentajeVisible(regalia.alicuota) / 100 : 0;
}

function obtenerDescuentosConfiguracion() {
  return obtenerConfiguracionComercial().descuentos
    .filter(descuento => descuento.activo !== false)
    .map(descuento => ({
      nombre: descuento.nombre,
      porcentaje: limitarPorcentajeVisible(descuento.porcentaje) / 100
    }));
}

function obtenerTablasPagoConfiguracion() {
  return obtenerConfiguracionComercial().tablasPago;
}

function obtenerPorcentajePago(elementoId, ley) {
  const tablas = obtenerTablasPagoConfiguracion();
  const tabla = tablas[elementoId];

  if (!tabla || tabla.activo === false) {
    throw new Error("No existe tabla de pago activa para el elemento " + elementoId + ".");
  }

  if (tabla.modo === "FIJO") {
    return limitarPorcentajeVisible(tabla.porcentajePago) / 100;
  }

  const leyNumerica = normalizarNumeroConfiguracion(ley, 0);
  const rango = tabla.rangos.find(item =>
    leyNumerica >= Number(item.desde) &&
    (
      leyNumerica < Number(item.hasta) ||
      (leyNumerica === Number(item.hasta) && Number(item.hasta) === 100)
    )
  );

  if (!rango) {
    throw new Error(
      "No existe rango de tabla de pago para " +
      elementoId +
      " con ley " +
      leyNumerica +
      "."
    );
  }

  return limitarPorcentajeVisible(rango.porcentajePago) / 100;
}

function registrarCambioTipoCambio(configuracion, oficial, comercial, usuario, fechaVigencia, fuenteObservacion) {
  const tipoCambioActual = configuracion.tipoCambio || {};
  const historial = Array.isArray(tipoCambioActual.historial)
    ? tipoCambioActual.historial
    : [];
  const fecha = fechaVigencia || obtenerFechaConfiguracionComercial();
  const fuente = fuenteObservacion || "";
  const vigente = obtenerValorTipoCambioVigente({
    vigente: oficial,
    oficial: oficial,
    comercial: comercial
  });

  if (
    obtenerValorTipoCambioVigente(tipoCambioActual) !== vigente ||
    tipoCambioActual.fechaVigencia !== fecha ||
    tipoCambioActual.fuenteObservacion !== fuente
  ) {
    historial.push({
      fechaVigencia: fecha,
      vigente: vigente,
      oficial: vigente,
      comercial: vigente,
      fuenteObservacion: fuente,
      usuario: usuario || "Administrador",
      fechaActualizacion: obtenerFechaConfiguracionComercial(),
      fechaHoraActualizacion: obtenerFechaHoraConfiguracionComercial()
    });
  }

  return historial;
}
