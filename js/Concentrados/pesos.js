function calcularPesos() {
  liquidacion.pesos.pesoNetoHumedoKg =
    liquidacion.pesos.pesoBrutoKg - liquidacion.pesos.taraKg;

  liquidacion.pesos.humedadKg =
    liquidacion.pesos.pesoNetoHumedoKg *
    liquidacion.pesos.humedadPorcentaje;

  liquidacion.pesos.pesoNetoSecoKg =
    liquidacion.pesos.pesoNetoHumedoKg -
    liquidacion.pesos.humedadKg;
}