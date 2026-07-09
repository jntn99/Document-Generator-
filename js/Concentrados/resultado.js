function calcularResultado() {
  const totalValorBruto = liquidacion.valorBruto.reduce(
    (total, item) => total + item.valorBob,
    0
  );

  const totalValorPagable = (liquidacion.valorPagable || []).reduce(
    (total, item) => total + item.valorPagableBob,
    0
  );

  const totalRegalias = liquidacion.regalias.reduce(
    (total, item) => total + item.montoBob,
    0
  );

  const totalDescuentos = liquidacion.descuentos.reduce(
    (total, item) => total + item.montoBob,
    0
  );

  liquidacion.resultado = {
    valorBrutoBob: totalValorBruto,
    valorPagableBob: totalValorPagable || totalValorBruto,
    totalRegaliasBob: totalRegalias,
    totalDescuentosBob: totalDescuentos,
    liquidoPagableBob: (totalValorPagable || totalValorBruto) - totalRegalias - totalDescuentos
  };
}
