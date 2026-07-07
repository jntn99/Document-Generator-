const reglasCalculo = {
  contenidoFino: {
    PORCENTAJE: function (pesoNetoSecoKg, ley) {
      return pesoNetoSecoKg * (ley / 100);
    },

    DECIMARCO: function (pesoNetoSecoKg, ley) {
      return ley * conversiones.decimarcoAGramos * (pesoNetoSecoKg / 1000);
    },

    GRAMOS_POR_TONELADA: function (pesoNetoSecoKg, ley) {
      return ley * (pesoNetoSecoKg / 1000);
    }
  },

  valorBruto: {
    KG_A_LIBRAS: function (cantidadFina, cotizacion, dolar) {
      return cantidadFina * conversiones.kgALibras * cotizacion * dolar;
    },

    GRAMOS_A_ONZAS: function (cantidadFina, cotizacion, dolar) {
      return cantidadFina * conversiones.gramoAOnzaTroy * cotizacion * dolar;
    }
  }
};

console.log("Reglas de cálculo cargadas:", reglasCalculo);