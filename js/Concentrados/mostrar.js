function mostrarDatosGenerales() {
  const cooperativa = buscarCooperativa(liquidacion.cooperativaId);
  const concentrado = buscarConcentrado(liquidacion.concentradoId);

  document.getElementById("codigo").textContent = liquidacion.codigo;
  document.getElementById("cooperativa").textContent = cooperativa.nombre;
  document.getElementById("concentrado").textContent = concentrado.nombre;
}

function mostrarPesos() {
  document.getElementById("pesoBruto").textContent =
    liquidacion.pesos.pesoBrutoKg.toFixed(2);

  document.getElementById("tara").textContent =
    liquidacion.pesos.taraKg.toFixed(2);

  document.getElementById("humedadKg").textContent =
    liquidacion.pesos.humedadKg.toFixed(2);

  document.getElementById("pesoNetoSeco").textContent =
    liquidacion.pesos.pesoNetoSecoKg.toFixed(2);
}

function mostrarElementosDelConcentrado() {
  const lista = document.getElementById("listaElementos");

  lista.innerHTML = "";

  liquidacion.analisis.forEach(analisisElemento => {
    const elemento = buscarElemento(analisisElemento.elementoId);

    if (!elemento) {
      return;
    }

    const li = document.createElement("li");

    li.textContent =
      elemento.nombre +
      " (" +
      elemento.simbolo +
      ") - Ley: " +
      analisisElemento.ley +
      " " +
      elemento.unidadLey +
      " - Cotización en " +
      elemento.unidadCotizacion;

    lista.appendChild(li);
  });
}

function mostrarContenidoFino() {
  const lista = document.getElementById("contenidoFino");

  lista.innerHTML = "";

  liquidacion.contenidoFino.forEach(item => {
    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): " +
      item.cantidad.toFixed(2) +
      " " +
      item.unidad;

    lista.appendChild(li);
  });
}

function mostrarCotizaciones() {
  const lista = document.getElementById("cotizaciones");

  lista.innerHTML = "";

  Object.keys(liquidacion.cotizaciones).forEach(elementoId => {
    const elemento = buscarElemento(elementoId);
    const cotizacion = liquidacion.cotizaciones[elementoId];

    if (!elemento || !cotizacion) {
      return;
    }

    const li = document.createElement("li");

    li.textContent =
      elemento.nombre +
      " (" +
      elemento.simbolo +
      "): " +
      cotizacion.valor +
      " " +
      cotizacion.unidad;

    lista.appendChild(li);
  });

  const dolarOF = document.createElement("li");
  dolarOF.textContent = "Dólar OF: " + liquidacion.tipoCambio.dolarOF;

  const dolarCOM = document.createElement("li");
  dolarCOM.textContent = "Dólar COM: " + liquidacion.tipoCambio.dolarCOM;

  lista.appendChild(dolarOF);
  lista.appendChild(dolarCOM);
}

function mostrarValorBruto() {
  const lista = document.getElementById("valorBruto");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.valorBruto.forEach(item => {
    total += item.valorBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): Bs " +
      item.valorBob.toFixed(2);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total valor bruto: Bs " + total.toFixed(2);

  lista.appendChild(totalLi);
}

function mostrarRegalias() {
  const lista = document.getElementById("regalias");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.regalias.forEach(item => {
    total += item.montoBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      " (" +
      item.simbolo +
      "): Bs " +
      item.montoBob.toFixed(2);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total regalías: Bs " + total.toFixed(2);

  lista.appendChild(totalLi);
}

function mostrarDescuentos() {
  const lista = document.getElementById("descuentos");

  lista.innerHTML = "";

  let total = 0;

  liquidacion.descuentos.forEach(item => {
    total += item.montoBob;

    const li = document.createElement("li");

    li.textContent =
      item.nombre +
      ": Bs " +
      item.montoBob.toFixed(2);

    lista.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.textContent = "Total descuentos: Bs " + total.toFixed(2);

  lista.appendChild(totalLi);
}
function mostrarResultadoFinal() {
  const lista = document.getElementById("resultadoFinal");

  lista.innerHTML = "";

  const valorBruto = document.createElement("li");
  valorBruto.textContent =
    "Valor bruto: Bs " + liquidacion.resultado.valorBrutoBob.toFixed(2);

  const regalias = document.createElement("li");
  regalias.textContent =
    "Regalías: Bs " + liquidacion.resultado.totalRegaliasBob.toFixed(2);

  const descuentos = document.createElement("li");
  descuentos.textContent =
    "Descuentos: Bs " + liquidacion.resultado.totalDescuentosBob.toFixed(2);

  const liquido = document.createElement("li");
  liquido.textContent =
    "Líquido pagable: Bs " + liquidacion.resultado.liquidoPagableBob.toFixed(2);

  lista.appendChild(valorBruto);
  lista.appendChild(regalias);
  lista.appendChild(descuentos);
  lista.appendChild(liquido);
}
