const elementos = [
  {
    id: "PB",
    nombre: "Plomo",
    simbolo: "Pb",
    unidadLey: "%",
    unidadContenido: "kg",
    unidadCotizacion: "L.F.",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS",
    controlMasa: true
  },
  {
    id: "AG",
    nombre: "Plata",
    simbolo: "Ag",
    unidadLey: "DM",
    unidadContenido: "gr",
    unidadCotizacion: "O.T.",
    tipoCalculoContenido: "DECIMARCO",
    tipoCalculoValor: "GRAMOS_A_ONZAS",
    controlMasa: false
  },
  {
    id: "AU",
    nombre: "Oro",
    simbolo: "Au",
    unidadLey: "g/TM",
    unidadContenido: "gr",
    unidadCotizacion: "O.T.",
    tipoCalculoContenido: "GRAMOS_POR_TONELADA",
    tipoCalculoValor: "GRAMOS_A_ONZAS",
    controlMasa: false
  },
  {
    id: "ZN",
    nombre: "Zinc",
    simbolo: "Zn",
    unidadLey: "%",
    unidadContenido: "kg",
    unidadCotizacion: "L.F.",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS",
    controlMasa: true
  },
  {
    id: "CU",
    nombre: "Cobre",
    simbolo: "Cu",
    unidadLey: "%",
    unidadContenido: "kg",
    unidadCotizacion: "L.F.",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS",
    controlMasa: true
  },
  {
    id: "SB",
    nombre: "Antimonio",
    simbolo: "Sb",
    unidadLey: "%",
    unidadContenido: "kg",
    unidadCotizacion: "TM",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS",
    controlMasa: true
  }
];

function obtenerElementosConfigurados() {
  const guardados = localStorage.getItem("elementosConfigurables");

  if (!guardados) {
    return [];
  }

  try {
    return JSON.parse(guardados);
  } catch (error) {
    console.warn("No se pudieron leer elementos configurables:", error);
    return [];
  }
}

function guardarElementosConfigurados(elementosConfigurados) {
  localStorage.setItem("elementosConfigurables", JSON.stringify(elementosConfigurados || []));
}

function aplicarElementosConfigurados() {
  obtenerElementosConfigurados().forEach(elementoConfigurado => {
    const indice = elementos.findIndex(elemento => elemento.id === elementoConfigurado.id);
    const normalizado = {
      ...elementoConfigurado,
      activo: elementoConfigurado.activo === false ? false : true
    };

    if (indice >= 0) {
      elementos[indice] = { ...elementos[indice], ...normalizado };
    } else {
      elementos.push(normalizado);
    }
  });
}

aplicarElementosConfigurados();

console.log("Elementos configurables cargados:", elementos);
