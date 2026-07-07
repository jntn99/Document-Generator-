function calcularValorBruto() {
  liquidacion.valorBruto = [];

  liquidacion.contenidoFino.forEach(item => {
    const elemento = buscarElemento(item.elementoId);
    const cotizacion = buscarCotizacion(item.elementoId);

    if (!elemento || !cotizacion) {
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
      liquidacion.tipoCambio.dolarOF
    );

    liquidacion.valorBruto.push({
      elementoId: item.elementoId,
      nombre: item.nombre,
      simbolo: item.simbolo,
      valorBob: valorBob
    });
  });
}