const elementos = [
  {
    id: "PB",
    nombre: "Plomo",
    simbolo: "Pb",
    unidadLey: "%",
    unidadContenido: "kg",
    unidadCotizacion: "L.F.",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS"
  },
  {
    id: "AG",
    nombre: "Plata",
    simbolo: "Ag",
    unidadLey: "DM",
    unidadContenido: "gr",
    unidadCotizacion: "O.T.",
    tipoCalculoContenido: "DECIMARCO",
    tipoCalculoValor: "GRAMOS_A_ONZAS"
  },
  {
    id: "AU",
    nombre: "Oro",
    simbolo: "Au",
    unidadLey: "g/TM",
    unidadContenido: "gr",
    unidadCotizacion: "O.T.",
    tipoCalculoContenido: "GRAMOS_POR_TONELADA",
    tipoCalculoValor: "GRAMOS_A_ONZAS"
  }
];

console.log("Elementos configurables cargados:", elementos);