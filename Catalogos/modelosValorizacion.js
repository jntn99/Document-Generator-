const modelosValorizacion = [
  {
    id: "MODELO_PB_AG",
    nombre: "Plomo - Plata",
    tipoMaterial: "MINERAL",
    tipoOperacion: "CONCENTRADO_MINERAL",
    plantillaId: "PLANTILLA_CONC_PB",
    elementosPrincipales: ["PB", "AG"],
    elementosOpcionales: ["ZN", "CU", "AU", "SB"],
    activo: true
  },
  {
    id: "MODELO_AU_AG",
    nombre: "Oro - Plata",
    tipoMaterial: "MINERAL",
    tipoOperacion: "CONCENTRADO_MINERAL",
    plantillaId: "PLANTILLA_CONC_AU",
    elementosPrincipales: ["AU", "AG"],
    elementosOpcionales: ["PB", "ZN", "CU", "SB"],
    activo: true
  },
  {
    id: "MODELO_SB",
    nombre: "Antimonio",
    tipoMaterial: "MINERAL",
    tipoOperacion: "CONCENTRADO_MINERAL",
    plantillaId: "PLANTILLA_CONC_SB",
    elementosPrincipales: ["SB"],
    elementosOpcionales: ["AG", "AU"],
    activo: true
  },
  {
    id: "MODELO_AU_FISICO",
    nombre: "Oro fisico",
    tipoMaterial: "METAL_FISICO",
    tipoOperacion: "METAL_FISICO",
    plantillaId: "PLANTILLA_LINGOTE_AU",
    elementosPrincipales: ["AU"],
    elementosOpcionales: [],
    activo: true
  }
];

function obtenerModelosValorizacion() {
  return modelosValorizacion;
}

function buscarModeloValorizacion(id) {
  return modelosValorizacion.find(modelo => modelo.id === id);
}

function buscarModeloValorizacionPorPlantilla(plantillaId) {
  return modelosValorizacion.find(modelo => modelo.plantillaId === plantillaId);
}

function obtenerElementosPrincipalesModelo(modelo, plantilla) {
  if (modelo && modelo.elementosPrincipales) {
    return modelo.elementosPrincipales;
  }

  return plantilla && plantilla.elementosPrincipales ? plantilla.elementosPrincipales : [];
}

function obtenerElementosOpcionalesModelo(modelo, plantilla) {
  if (modelo && modelo.elementosOpcionales) {
    return modelo.elementosOpcionales;
  }

  return plantilla && plantilla.elementosOpcionales ? plantilla.elementosOpcionales : [];
}

console.log("Modelos de valorizacion cargados:", modelosValorizacion);
