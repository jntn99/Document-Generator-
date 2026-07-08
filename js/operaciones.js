console.log("Modulo de operaciones cargado");

const PRESENTACIONES_POR_TIPO_MATERIAL = {
  MINERAL: [
    { id: "MINERAL_BRUTO", nombre: "Mineral en bruto" },
    { id: "CONCENTRADO", nombre: "Concentrado" },
    { id: "MATERIAL_SELECCIONADO", nombre: "Material seleccionado" },
    { id: "GRANZA", nombre: "Granza" },
    { id: "RELAVE", nombre: "Relave" },
    { id: "OTRO", nombre: "Otro" }
  ],
  METAL_FISICO: [
    { id: "LINGOTE", nombre: "Lingote" },
    { id: "PEPAS", nombre: "Pepas" },
    { id: "GRANALLADO", nombre: "Granallado" },
    { id: "POLVO", nombre: "Polvo" },
    { id: "SCRAP", nombre: "Scrap" },
    { id: "OTRO", nombre: "Otro" }
  ]
};

const TIPO_OPERACION_POR_TIPO_MATERIAL = {
  MINERAL: "CONCENTRADO_MINERAL",
  METAL_FISICO: "METAL_FISICO"
};

const tipoMaterialSelect = document.getElementById("tipoMaterial");
const presentacionMaterialSelect = document.getElementById("presentacionMaterial");
const modeloValorizacionSelect = document.getElementById("modeloValorizacion");
const btnContinuar = document.getElementById("btnContinuar");

function limpiarSelect(select, textoInicial) {
  select.innerHTML = "";

  const option = document.createElement("option");
  option.value = "";
  option.textContent = textoInicial;
  select.appendChild(option);
}

function cargarPresentaciones(tipoMaterial) {
  limpiarSelect(presentacionMaterialSelect, "Seleccione una presentacion");

  const presentaciones = PRESENTACIONES_POR_TIPO_MATERIAL[tipoMaterial] || [];

  presentaciones.forEach(presentacion => {
    const option = document.createElement("option");
    option.value = presentacion.id;
    option.textContent = presentacion.nombre;
    presentacionMaterialSelect.appendChild(option);
  });
}

function cargarModelosValorizacion(tipoMaterial) {
  limpiarSelect(modeloValorizacionSelect, "Seleccione un modelo de valorizacion");

  const modelos = obtenerModelosValorizacion().filter(
    modelo => modelo.tipoMaterial === tipoMaterial && modelo.activo
  );

  modelos.forEach(modelo => {
    const option = document.createElement("option");
    option.value = modelo.id;
    option.textContent = modelo.nombre;
    modeloValorizacionSelect.appendChild(option);
  });
}

tipoMaterialSelect.addEventListener("change", function () {
  const tipoMaterial = tipoMaterialSelect.value;

  cargarPresentaciones(tipoMaterial);
  cargarModelosValorizacion(tipoMaterial);
});

btnContinuar.addEventListener("click", function () {
  const tipoMaterial = tipoMaterialSelect.value;
  const presentacionMaterial = presentacionMaterialSelect.value;
  const modeloValorizacionId = modeloValorizacionSelect.value;

  if (!tipoMaterial) {
    alert("Seleccione un tipo de material antes de continuar.");
    return;
  }

  if (!presentacionMaterial) {
    alert("Seleccione una presentacion antes de continuar.");
    return;
  }

  if (!modeloValorizacionId) {
    alert("Seleccione un modelo de valorizacion antes de continuar.");
    return;
  }

  const modeloValorizacion = buscarModeloValorizacion(modeloValorizacionId);
  if (!modeloValorizacion) {
    alert("El modelo de valorizacion seleccionado no existe.");
    return;
  }

  const plantillaId = modeloValorizacion.plantillaId;
  const plantilla = buscarPlantilla(plantillaId);
  if (!plantilla) {
    alert("El modelo de valorizacion no tiene configuracion tecnica disponible.");
    return;
  }

  const expediente = crearExpedienteDesdePlantilla(plantilla, {
    tipoMaterial: tipoMaterial,
    presentacionMaterial: presentacionMaterial,
    modeloValorizacionId: modeloValorizacion.id
  });

  localStorage.setItem("plantillaSeleccionadaId", plantilla.id);
  guardarExpedienteActual(expediente);

  if (plantilla.tipoOperacion === "CONCENTRADO_MINERAL") {
    window.location.href = "concentrados.html";
  }

  if (plantilla.tipoOperacion === "METAL_FISICO") {
    window.location.href = "lingotes.html";
  }
});
