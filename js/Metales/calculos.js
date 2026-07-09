function validarItemMetal(item, indice) {
  const errores = [];
  const numeroFila = indice + 1;
  const metal = buscarMetalFisico(item.metalId);
  const cotizacion = buscarCotizacionMetal(item.metalId);

  if (!metal) {
    errores.push("Fila " + numeroFila + ": seleccione un metal valido.");
  }

  if (
    metal &&
    typeof esPresentacionPermitidaMetal === "function" &&
    !esPresentacionPermitidaMetal(item.metalId, item.presentacionId)
  ) {
    errores.push(
      "Fila " +
      numeroFila +
      ": la presentacion seleccionada no es valida para " +
      metal.nombre +
      "."
    );
  }

  if (item.pesoGr <= 0) {
    errores.push("Fila " + numeroFila + ": el peso debe ser mayor a 0.");
  }

  item.analisisMetalurgico = calcularAnalisisMetalurgico(item.analisisMetalurgico);

  if (item.analisisMetalurgico.lecturas.length === 0) {
    errores.push("Fila " + numeroFila + ": registre al menos una lectura XRF con taladro.");
  }

  item.analisisMetalurgico.lecturas.forEach((lectura, lecturaIndice) => {
    if (lectura.purezaPorcentaje <= 0 || lectura.purezaPorcentaje > 100) {
      errores.push(
        "Fila " +
        numeroFila +
        ", lectura " +
        (lecturaIndice + 1) +
        ": la pureza XRF debe estar entre 0 y 100%."
      );
    }
  });

  if (
    item.analisisMetalurgico.promedioPureza <= 0 ||
    item.analisisMetalurgico.promedioPureza > 100
  ) {
    errores.push("Fila " + numeroFila + ": la pureza promedio XRF debe estar entre 0 y 100%.");
  }

  if (item.descuentoPorcentaje < 0 || item.descuentoPorcentaje > 100) {
    errores.push("Fila " + numeroFila + ": el descuento debe estar entre 0 y 100%.");
  }

  if (!cotizacion) {
    errores.push(
      "Fila " +
      numeroFila +
      ": " +
      obtenerMensajeCotizacionFaltante(item.metalId)
    );
  } else if (Number(cotizacion.valor) <= 0) {
    errores.push(
      "Fila " +
      numeroFila +
      ": " +
      obtenerMensajeCotizacionFaltante(item.metalId)
    );
  }

  if ((cotizacionMetales.tipoCambio.dolarOF || 0) <= 0) {
    errores.push("El tipo de cambio debe ser mayor a 0.");
  }

  return errores;
}

function validarCotizacionMetales() {
  const errores = [];
  const validacionTipoCambio =
    typeof validarTipoCambioVigente === "function"
      ? validarTipoCambioVigente(cotizacionMetales.tipoCambio)
      : {
          valido: (cotizacionMetales.tipoCambio.dolarOF || 0) > 0,
          mensaje: "Debe configurar el tipo de cambio vigente antes de calcular."
        };

  if (!cotizacionMetales.tipoOperacionComercial) {
    errores.push("Seleccione un tipo de operacion.");
  }

  if (!validacionTipoCambio.valido) {
    errores.push(validacionTipoCambio.mensaje);
  }

  if (cotizacionMetales.items.length === 0) {
    errores.push("Debe agregar al menos un item.");
  }

  cotizacionMetales.items.forEach((item, indice) => {
    errores.push(...validarItemMetal(item, indice));
  });

  return {
    valido: errores.length === 0,
    errores: errores
  };
}

function calcularItemMetal(item) {
  const metal = buscarMetalFisico(item.metalId);
  const cotizacion = buscarCotizacionMetal(item.metalId);
  const unidadCotizacion = cotizacion ? cotizacion.unidad : metal.unidadCotizacion;
  const tipoCambio = cotizacionMetales.tipoCambio.dolarOF || 0;
  const analisisMetalurgico = calcularAnalisisMetalurgico(item.analisisMetalurgico);
  const purezaAplicada = analisisMetalurgico.promedioPureza;

  item.analisisMetalurgico = analisisMetalurgico;
  item.leyPorcentaje = purezaAplicada;
  item.finosGr = item.pesoGr * (purezaAplicada / 100);
  item.cotizacion = Number(cotizacion.valor) || 0;
  item.unidadCotizacion = unidadCotizacion;
  item.tipoCambio = tipoCambio;

  if (unidadCotizacion === "O.T.") {
    item.valorUsd = (item.finosGr / 31.1035) * item.cotizacion;
  } else if (unidadCotizacion === "gr") {
    item.valorUsd = item.finosGr * item.cotizacion;
  } else if (unidadCotizacion === "TM") {
    item.valorUsd = (item.finosGr / 1000000) * item.cotizacion;
  } else {
    item.valorUsd = 0;
  }

  item.valorBob = item.valorUsd * tipoCambio;
  item.totalBob = item.valorBob * (1 - item.descuentoPorcentaje / 100);
  item.totalUsd = tipoCambio > 0 ? item.totalBob / tipoCambio : 0;
  item.totalAl90Bob = item.valorBob * 0.90;

  return item;
}

function calcularMetales() {
  cotizacionMetales.items = cotizacionMetales.items.map(calcularItemMetal);
  cotizacionMetales.totales = cotizacionMetales.items.reduce(
    (totales, item) => {
      totales.totalUsd += item.totalUsd;
      totales.totalBob += item.totalBob;
      totales.totalAl90Bob += item.totalAl90Bob;
      return totales;
    },
    { totalUsd: 0, totalBob: 0, totalAl90Bob: 0 }
  );
}
