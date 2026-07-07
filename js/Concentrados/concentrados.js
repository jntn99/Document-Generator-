console.log("Modulo principal de concentrados iniciado");

function obtenerNumeroDesdeInput(id) {
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

function actualizarLiquidacionDesdeFormulario() {
  const pesoBrutoKg = obtenerNumeroDesdeInput("inputPesoBruto");
  const taraKg = obtenerNumeroDesdeInput("inputTara");
  const humedadPorcentaje = obtenerNumeroDesdeInput("inputHumedad");
  const leyPB = obtenerNumeroDesdeInput("inputLeyPB");
  const leyAG = obtenerNumeroDesdeInput("inputLeyAG");

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
    if (item.elementoId === "PB" && leyPB !== null) {
      item.ley = leyPB;
    }

    if (item.elementoId === "AG" && leyAG !== null) {
      item.ley = leyAG;
    }
  });
}

function ejecutarCalculoConcentrados() {
  actualizarLiquidacionDesdeFormulario();

  calcularPesos();
  calcularContenidoFino();
  calcularValorBruto();
  calcularRegalias();
  calcularDescuentos();
  calcularResultado();

  mostrarDatosGenerales();
  mostrarPesos();
  mostrarElementosDelConcentrado();
  mostrarElementosOpcionalesDisponibles();
  mostrarContenidoFino();
  mostrarCotizaciones();
  mostrarValorBruto();
  mostrarRegalias();
  mostrarDescuentos();
  mostrarResultadoFinal();
}

function configurarAccionesConcentrados() {
  const btnCalcular = document.getElementById("btnCalcular");
  const btnAgregarElemento = document.getElementById("btnAgregarElemento");
  const selectElementoOpcional = document.getElementById("selectElementoOpcional");
  const inputLeyElementoOpcional = document.getElementById("inputLeyElementoOpcional");

  if (btnCalcular) {
    btnCalcular.addEventListener("click", ejecutarCalculoConcentrados);
  }

  if (!btnAgregarElemento) {
    return;
  }

  btnAgregarElemento.addEventListener("click", function () {
    const elementoId = selectElementoOpcional.value;
    const ley = obtenerNumeroDesdeInput("inputLeyElementoOpcional");

    if (!elementoId) {
      alert("Seleccione un elemento opcional.");
      return;
    }

    if (ley === null) {
      alert("Ingrese la ley del elemento opcional.");
      return;
    }

    const yaExiste = liquidacion.analisis.some(
      item => item.elementoId === elementoId
    );

    if (yaExiste) {
      alert("Este elemento ya fue agregado.");
      return;
    }

    liquidacion.analisis.push({
      elementoId: elementoId,
      ley: ley
    });

    inputLeyElementoOpcional.value = "";
    ejecutarCalculoConcentrados();
  });
}

configurarAccionesConcentrados();
ejecutarCalculoConcentrados();

console.log("Liquidacion final:", liquidacion);
