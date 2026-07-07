const plantillasLiquidacion = {
  concentradosMinerales: [
    {
      id: "PLANTILLA_CONC_PB",
      nombre: "Concentrado de Plomo",
      tipoOperacion: "CONCENTRADO_MINERAL",
      concentradoId: "CONC_PB",
      elementosPrincipales: ["PB", "AG"],
      elementosOpcionales: ["ZN", "CU", "AU", "SB"],
      usaPesos: true,
      usaHumedad: true,
      usaTara: true,
      usaMerma: false,
      usaRegalias: true,
      usaDescuentos: true,
      activo: true
    },
    {
      id: "PLANTILLA_CONC_AU",
      nombre: "Concentrado de Oro",
      tipoOperacion: "CONCENTRADO_MINERAL",
      concentradoId: "CONC_AU",
      elementosPrincipales: ["AU", "AG"],
      elementosOpcionales: ["PB", "ZN", "CU", "SB"],
      usaPesos: true,
      usaHumedad: true,
      usaTara: true,
      usaMerma: false,
      usaRegalias: true,
      usaDescuentos: true,
      activo: true
    },
    {
      id: "PLANTILLA_CONC_SB",
      nombre: "Concentrado de Antimonio",
      tipoOperacion: "CONCENTRADO_MINERAL",
      concentradoId: "CONC_SB",
      elementosPrincipales: ["SB"],
      elementosOpcionales: ["AG", "AU"],
      usaPesos: true,
      usaHumedad: true,
      usaTara: true,
      usaMerma: false,
      usaRegalias: true,
      usaDescuentos: true,
      activo: true
    }
  ],

  metalesFisicos: [
    {
      id: "PLANTILLA_LINGOTE_AU",
      nombre: "Oro en Lingote",
      tipoOperacion: "METAL_FISICO",
      forma: "LINGOTE",
      elementos: ["AU"],
      usaPesos: true,
      usaPureza: true,
      usaHumedad: false,
      usaTara: false,
      usaMerma: false,
      usaRegalias: false,
      usaDescuentos: true,
      activo: true
    },
    {
      id: "PLANTILLA_PEPAS_AU",
      nombre: "Oro en Pepas",
      tipoOperacion: "METAL_FISICO",
      forma: "PEPAS",
      elementos: ["AU"],
      usaPesos: true,
      usaPureza: true,
      usaHumedad: false,
      usaTara: false,
      usaMerma: false,
      usaRegalias: false,
      usaDescuentos: true,
      activo: true
    }
  ]
};

function obtenerTodasLasPlantillas() {
  return [
    ...plantillasLiquidacion.concentradosMinerales,
    ...plantillasLiquidacion.metalesFisicos
  ];
}

function buscarPlantilla(id) {
  return obtenerTodasLasPlantillas().find(plantilla => plantilla.id === id);
}

console.log("Plantillas de liquidación cargadas:", plantillasLiquidacion);
