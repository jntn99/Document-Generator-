console.log("Modulo principal de concentrados iniciado");

function mostrarLiquidacionConcentrados() {
  mostrarDatosGenerales();
  mostrarPesos();
  mostrarElementosDelConcentrado();
  mostrarContenidoFino();
  mostrarCotizaciones();
  mostrarValorBruto();
  mostrarRegalias();
  mostrarDescuentos();
  mostrarResultadoFinal();

  if (typeof mostrarExpedienteActual === "function") {
    mostrarExpedienteActual(expedienteActual);
  }
}

function ejecutarCalculoConcentrados() {
  leerFormularioConcentrados();

  const validacion = validarLiquidacion();

  if (!validacion.valido) {
    alert(validacion.errores.join("\n"));
    throw new Error("Liquidacion invalida.");
  }

  if (validacion.advertencias.length > 0) {
    console.warn("Advertencias de validacion:", validacion.advertencias);
  }

  calcularPesos();
  calcularContenidoFino();
  calcularValorBruto();
  calcularRegalias();
  calcularDescuentos();
  calcularResultado();

  if (expedienteActual) {
    actualizarExpedienteDesdeLiquidacion(expedienteActual, liquidacion);
    guardarExpedienteActual(expedienteActual);
  }

  mostrarLiquidacionConcentrados();
}

function configurarAccionesConcentrados() {
  const btnCalcular = document.getElementById("btnCalcular");

  if (btnCalcular) {
    btnCalcular.addEventListener("click", ejecutarCalculoConcentrados);
  }

  if (typeof configurarAccionesExpediente === "function") {
    configurarAccionesExpediente();
  }

  if (typeof configurarProveedorEditable === "function") {
    configurarProveedorEditable();
  }

  if (typeof configurarTituloEditable === "function") {
    configurarTituloEditable();
  }
}

generarFormularioConcentrados();
configurarAccionesConcentrados();
ejecutarCalculoConcentrados();

console.log("Liquidacion final:", liquidacion);
