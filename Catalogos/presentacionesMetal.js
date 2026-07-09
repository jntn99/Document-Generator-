const presentacionesMetal = [
  {
    id: "LINGOTE",
    nombre: "Lingote",
    descuentoDefault: 4,
    activo: true
  },
  {
    id: "PEPAS",
    nombre: "Pepas",
    descuentoDefault: 6,
    activo: true
  },
  {
    id: "GRANALLA",
    nombre: "Granalla",
    descuentoDefault: 5,
    activo: true
  },
  {
    id: "POLVO",
    nombre: "Polvo",
    descuentoDefault: 8,
    activo: true
  },
  {
    id: "SCRAP",
    nombre: "Scrap",
    descuentoDefault: 10,
    activo: true
  },
  {
    id: "OTRO",
    nombre: "Otro",
    descuentoDefault: 0,
    activo: true
  }
];

const PRESENTACIONES_PERMITIDAS_POR_METAL = {
  AU: ["LINGOTE", "PEPAS", "POLVO", "SCRAP", "OTRO"],
  AG: ["LINGOTE", "GRANALLA", "POLVO", "SCRAP", "OTRO"],
  SN: ["LINGOTE", "GRANALLA", "OTRO"]
};

function buscarPresentacionMetal(id) {
  return presentacionesMetal.find(presentacion => presentacion.id === id);
}

function obtenerPresentacionesPermitidasMetal(metalId) {
  const permitidas = PRESENTACIONES_PERMITIDAS_POR_METAL[metalId] || [];

  return presentacionesMetal.filter(presentacion =>
    presentacion.activo &&
    (permitidas.length === 0 || permitidas.includes(presentacion.id))
  );
}

function esPresentacionPermitidaMetal(metalId, presentacionId) {
  return obtenerPresentacionesPermitidasMetal(metalId)
    .some(presentacion => presentacion.id === presentacionId);
}

console.log("Presentaciones de metal cargadas:", presentacionesMetal);
