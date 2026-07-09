const metalesFisicos = [
  {
    id: "AU",
    nombre: "Oro",
    simbolo: "Au",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "O.T.",
    activo: true
  },
  {
    id: "AG",
    nombre: "Plata",
    simbolo: "Ag",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "O.T.",
    activo: true
  },
  {
    id: "SN",
    nombre: "Estano",
    simbolo: "Sn",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "TM",
    activo: true
  }
];

function buscarMetalFisico(id) {
  return metalesFisicos.find(metal => metal.id === id);
}

console.log("Metales fisicos cargados:", metalesFisicos);
