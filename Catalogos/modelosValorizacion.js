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
    nombre: "Oro Fisico",
    tipoMaterial: "METAL_FISICO",
    tipoOperacion: "METAL_FISICO",
    plantillaId: "PLANTILLA_METAL_AU",
    elementosPrincipales: ["AU"],
    elementosOpcionales: [],
    activo: true
  },
  {
    id: "MODELO_AG_FISICO",
    nombre: "Plata Fisica",
    tipoMaterial: "METAL_FISICO",
    tipoOperacion: "METAL_FISICO",
    plantillaId: "PLANTILLA_METAL_AG",
    elementosPrincipales: ["AG"],
    elementosOpcionales: [],
    activo: true
  },
  {
    id: "MODELO_SN_FISICO",
    nombre: "Estano Fisico",
    tipoMaterial: "METAL_FISICO",
    tipoOperacion: "METAL_FISICO",
    plantillaId: "PLANTILLA_METAL_SN",
    elementosPrincipales: ["SN"],
    elementosOpcionales: [],
    activo: true
  }
];

function obtenerModelosValorizacionConfigurados() {
  const guardados = localStorage.getItem("modelosValorizacionConfigurables");

  if (!guardados) {
    return [];
  }

  try {
    return JSON.parse(guardados);
  } catch (error) {
    console.warn("No se pudieron leer modelos de valorizacion configurables:", error);
    return [];
  }
}

function guardarModelosValorizacionConfigurados(modelosConfigurados) {
  localStorage.setItem(
    "modelosValorizacionConfigurables",
    JSON.stringify(modelosConfigurados || [])
  );
}

function obtenerModelosValorizacion() {
  const modelos = modelosValorizacion.map(modelo => ({ ...modelo }));

  obtenerModelosValorizacionConfigurados().forEach(modeloConfigurado => {
    const indice = modelos.findIndex(modelo => modelo.id === modeloConfigurado.id);

    if (indice >= 0) {
      modelos[indice] = { ...modelos[indice], ...modeloConfigurado };
    } else {
      modelos.push({ ...modeloConfigurado });
    }
  });

  return modelos;
}

function buscarModeloValorizacion(id) {
  return obtenerModelosValorizacion().find(modelo => modelo.id === id);
}

function buscarModeloValorizacionPorPlantilla(plantillaId) {
  return obtenerModelosValorizacion().find(modelo => modelo.plantillaId === plantillaId);
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
