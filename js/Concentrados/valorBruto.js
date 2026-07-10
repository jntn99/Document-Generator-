function calcularValorBruto() {
  liquidacion.valorBruto = [];
  liquidacion.tipoCambio =
    typeof normalizarTipoCambioVigente === "function"
      ? normalizarTipoCambioVigente(liquidacion.tipoCambio)
      : liquidacion.tipoCambio;

  liquidacion.contenidoFino.forEach(item => {
    const elemento = buscarElemento(item.elementoId);
    const cotizacion = buscarCotizacion(item.elementoId);

    if (!elemento) {
      return;
    }

    if (!cotizacion) {
      console.warn("No existe cotizacion para:", elemento.id);
      return;
    }

    const formula =
      reglasCalculo.valorBruto[elemento.tipoCalculoValor];

    if (!formula) {
      console.error("No existe fórmula de valor bruto para:", elemento.id);
      return;
    }

    const valorBob = formula(
      item.cantidad,
      cotizacion.valor,
      liquidacion.tipoCambio.vigente || liquidacion.tipoCambio.dolarOF
    );

    liquidacion.valorBruto.push({
      elementoId: item.elementoId,
      nombre: item.nombre,
      simbolo: item.simbolo,
      valorBob: valorBob
    });
  });
}
