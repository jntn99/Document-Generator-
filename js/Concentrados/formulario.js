function crearGrupoFormulario(titulo) {
  const grupo = document.createElement("section");
  const encabezado = document.createElement("h3");

  encabezado.textContent = titulo;
  grupo.appendChild(encabezado);

  return grupo;
}

function crearInputNumerico(configuracion) {
  const contenedor = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");

  label.setAttribute("for", configuracion.id);
  label.textContent = configuracion.etiqueta;

  input.type = "number";
  input.id = configuracion.id;
  input.value = configuracion.valorInicial;

  if (configuracion.step) {
    input.step = configuracion.step;
  }

  contenedor.appendChild(label);
  contenedor.appendChild(document.createElement("br"));
  contenedor.appendChild(input);

  return contenedor;
}

function obtenerValorFormulario(id) {
  const input = document.getElementById(id);

  if (!input || input.value === "") {
    return null;
  }

  const valor = Number(input.value);

  if (Number.isNaN(valor)) {
    return null;
  }

  return valor;
}

function generarFormularioConcentrados() {
  const contenedor = document.getElementById("formularioConcentrados");

  if (!contenedor) {
    return;
  }

  contenedor.innerHTML = "";

  const datosFisicos = crearGrupoFormulario("Datos fisicos");

  datosFisicos.appendChild(
    crearInputNumerico({
      id: "inputPesoBruto",
      etiqueta: "Peso bruto kg:",
      valorInicial: liquidacion.pesos.pesoBrutoKg,
      step: "0.01"
    })
  );

  datosFisicos.appendChild(
    crearInputNumerico({
      id: "inputTara",
      etiqueta: "Tara kg:",
      valorInicial: liquidacion.pesos.taraKg,
      step: "0.01"
    })
  );

  datosFisicos.appendChild(
    crearInputNumerico({
      id: "inputHumedad",
      etiqueta: "Humedad %:",
      valorInicial: liquidacion.pesos.humedadPorcentaje * 100,
      step: "0.01"
    })
  );

  contenedor.appendChild(datosFisicos);

  const analisisQuimico = crearGrupoFormulario("Analisis quimico");

  liquidacion.analisis.forEach(item => {
    const elemento = buscarElemento(item.elementoId);

    if (!elemento) {
      return;
    }

    analisisQuimico.appendChild(
      crearInputNumerico({
        id: "inputLey_" + elemento.id,
        etiqueta: "Ley " + elemento.simbolo + " (" + elemento.unidadLey + "):",
        valorInicial: item.ley,
        step: "0.01"
      })
    );
  });

  contenedor.appendChild(analisisQuimico);

  const opcionales = crearGrupoFormulario("Elementos opcionales");
  const botonAgregar = document.createElement("button");
  const mensaje = document.createElement("p");

  botonAgregar.id = "btnAgregarElemento";
  botonAgregar.type = "button";
  botonAgregar.textContent = "Agregar elemento";
  botonAgregar.disabled = true;
  mensaje.id = "elementosOpcionales";
  mensaje.textContent =
    "Disponible para la siguiente fase: " +
    liquidacion.elementosOpcionales.join(", ");

  opcionales.appendChild(botonAgregar);
  opcionales.appendChild(mensaje);
  contenedor.appendChild(opcionales);
}

function leerFormularioConcentrados() {
  const pesoBrutoKg = obtenerValorFormulario("inputPesoBruto");
  const taraKg = obtenerValorFormulario("inputTara");
  const humedadPorcentaje = obtenerValorFormulario("inputHumedad");

  if (pesoBrutoKg !== null) {
    liquidacion.pesos.pesoBrutoKg = pesoBrutoKg;
  }

  if (taraKg !== null) {
    liquidacion.pesos.taraKg = taraKg;
  }

  if (humedadPorcentaje !== null) {
    liquidacion.pesos.humedadPorcentaje = humedadPorcentaje / 100;
  }

  liquidacion.analisis.forEach(item => {
    const ley = obtenerValorFormulario("inputLey_" + item.elementoId);

    if (ley !== null) {
      item.ley = ley;
    }
  });
}
