function validarSumaPorcentual() {
  let sumaPorcentual = 0;
  const elementosIncluidos = [];
  const parametros =
    typeof obtenerParametrosConfiguracionComercial === "function"
      ? obtenerParametrosConfiguracionComercial()
      : { toleranciaLeyesPorcentaje: 0.5 };
  const tolerancia = Number(parametros.toleranciaLeyesPorcentaje) || 0;

  liquidacion.analisis.forEach(item => {
    const elemento = buscarElemento(item.elementoId);

    if (!elemento) {
      return;
    }

    if (elemento.controlMasa === true) {
      const ley = Number(item.ley) || 0;
      sumaPorcentual += ley;

      elementosIncluidos.push({
        elementoId: elemento.id,
        simbolo: elemento.simbolo,
        ley: ley
      });
    }
  });

  const resultado = {
    estado: "OK",
    sumaPorcentual: sumaPorcentual,
    elementosIncluidos: elementosIncluidos,
    mensajes: []
  };

  if (sumaPorcentual > 100 + tolerancia) {
    resultado.estado = "ERROR";
    resultado.mensajes.push(
      "La suma de leyes porcentuales supera el limite permitido. Suma actual: " +
      sumaPorcentual.toFixed(2) +
      "%."
    );
    return resultado;
  }

  if (sumaPorcentual > 100) {
    resultado.estado = "ADVERTENCIA";
    resultado.mensajes.push(
      "La suma de leyes porcentuales supera levemente el 100%. Revisar redondeos o analisis de laboratorio. Suma actual: " +
      sumaPorcentual.toFixed(2) +
      "%."
    );
    return resultado;
  }

  resultado.mensajes.push(
    "Suma porcentual valida: " + sumaPorcentual.toFixed(2) + "%."
  );

  return resultado;
}

function validarLiquidacion() {
  const errores = [];
  const advertencias = [];
  const parametros =
    typeof obtenerParametrosConfiguracionComercial === "function"
      ? obtenerParametrosConfiguracionComercial()
      : { humedadMaximaPorcentaje: 100 };
  const humedadMaxima = (Number(parametros.humedadMaximaPorcentaje) || 0) / 100;
  const validacionTipoCambio =
    typeof validarTipoCambioVigente === "function"
      ? validarTipoCambioVigente(liquidacion.tipoCambio)
      : {
          valido: (liquidacion.tipoCambio.dolarOF || 0) > 0,
          mensaje: "Debe configurar el tipo de cambio vigente antes de calcular."
        };

  if (!validacionTipoCambio.valido) {
    errores.push(validacionTipoCambio.mensaje);
  }

  if (liquidacion.pesos.pesoBrutoKg <= 0) {
    errores.push("El peso bruto debe ser mayor a 0.");
  }

  if (liquidacion.pesos.taraKg < 0) {
    errores.push("La tara no puede ser negativa.");
  }

  if (liquidacion.pesos.taraKg >= liquidacion.pesos.pesoBrutoKg) {
    errores.push("La tara no puede ser igual o mayor al peso bruto.");
  }

  if (
    liquidacion.pesos.humedadPorcentaje < 0 ||
    liquidacion.pesos.humedadPorcentaje > humedadMaxima
  ) {
    errores.push(
      "La humedad debe estar entre 0% y " +
      Number(parametros.humedadMaximaPorcentaje).toFixed(2) +
      "%."
    );
  }

  const validacionPorcentual = validarSumaPorcentual();

  if (validacionPorcentual.estado === "ERROR") {
    errores.push(...validacionPorcentual.mensajes);
  }

  if (validacionPorcentual.estado === "ADVERTENCIA") {
    advertencias.push(...validacionPorcentual.mensajes);
  }

  if (typeof obtenerPorcentajePago === "function") {
    liquidacion.analisis.forEach(item => {
      try {
        const porcentajePago = obtenerPorcentajePago(item.elementoId, item.ley);

        if (porcentajePago === 0) {
          advertencias.push(
            "El porcentaje de pago para " +
            item.elementoId +
            " es 0%. Revisar tabla de pago."
          );
        }
      } catch (error) {
        errores.push(error.message);
      }
    });
  }

  return {
    valido: errores.length === 0,
    errores: errores,
    advertencias: advertencias,
    sumaPorcentual: validacionPorcentual.sumaPorcentual
  };
}
