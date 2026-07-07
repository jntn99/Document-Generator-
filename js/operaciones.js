console.log("Módulo de operaciones cargado");

const tipoOperacionSelect = document.getElementById("tipoOperacion");
const plantillaSelect = document.getElementById("plantilla");
const btnContinuar = document.getElementById("btnContinuar");

tipoOperacionSelect.addEventListener("change", function () {
  const tipoSeleccionado = tipoOperacionSelect.value;

  plantillaSelect.innerHTML = '<option value="">Seleccione una plantilla</option>';

  if (!tipoSeleccionado) {
    return;
  }

  const plantillas = obtenerTodasLasPlantillas().filter(
    plantilla => plantilla.tipoOperacion === tipoSeleccionado && plantilla.activo
  );

  plantillas.forEach(plantilla => {
    const option = document.createElement("option");
    option.value = plantilla.id;
    option.textContent = plantilla.nombre;
    plantillaSelect.appendChild(option);
  });
});

btnContinuar.addEventListener("click", function () {
  const plantillaId = plantillaSelect.value;

  if (!plantillaId) {
    alert("Seleccione una plantilla antes de continuar.");
    return;
  }

  const plantilla = buscarPlantilla(plantillaId);

  localStorage.setItem("plantillaSeleccionadaId", plantilla.id);

  if (plantilla.tipoOperacion === "CONCENTRADO_MINERAL") {
    window.location.href = "concentrados.html";
  }

  if (plantilla.tipoOperacion === "METAL_FISICO") {
    window.location.href = "lingotes.html";
  }
});