function validarSumaPorcentual() {
  let sumaPorcentual = 0;
  const elementosIncluidos = [];

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

  if (sumaPorcentual > 100.5) {
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
    liquidacion.pesos.humedadPorcentaje > 1
  ) {
    errores.push("La humedad debe estar entre 0% y 100%.");
  }

  const validacionPorcentual = validarSumaPorcentual();

  if (validacionPorcentual.estado === "ERROR") {
    errores.push(...validacionPorcentual.mensajes);
  }

  if (validacionPorcentual.estado === "ADVERTENCIA") {
    advertencias.push(...validacionPorcentual.mensajes);
  }

  return {
    valido: errores.length === 0,
    errores: errores,
    advertencias: advertencias,
    sumaPorcentual: validacionPorcentual.sumaPorcentual
  };
}
