function calcularDescuentos() {
  const totalValorBruto = liquidacion.valorBruto.reduce(
    (total, item) => total + item.valorBob,
    0
  );

  const cns = totalValorBruto * 0.018;
  const fedecomin = totalValorBruto * 0.0035;
  const administracion = totalValorBruto * 0.01;

  liquidacion.descuentos = [
    { nombre: "CNS", porcentaje: 0.018, montoBob: cns },
    { nombre: "FEDECOMIN", porcentaje: 0.0035, montoBob: fedecomin },
    { nombre: "Administración", porcentaje: 0.01, montoBob: administracion }
  ];
}