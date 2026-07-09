function formatearNumeroMetal(valor, decimales) {
  return Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

function formatearBobMetal(valor) {
  return "Bs " + formatearNumeroMetal(valor, 2);
}

function formatearUsdMetal(valor) {
  return "USD " + formatearNumeroMetal(valor, 2);
}

function crearCeldaMetal(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function mostrarDatosGeneralesMetales() {
  const codigo = document.getElementById("codigoMetal");
  const fecha = document.getElementById("fechaMetal");
  const proveedor = document.getElementById("proveedorMetal");

  if (codigo) {
    codigo.textContent = cotizacionMetales.codigo;
  }

  if (fecha) {
    fecha.textContent = cotizacionMetales.fecha;
  }

  if (proveedor) {
    proveedor.textContent =
      (cotizacionMetales.proveedor && cotizacionMetales.proveedor.cooperativaEmpresa) ||
      cotizacionMetales.proveedorId ||
      "Proveedor no definido";
  }
}

function mostrarResultadosMetales() {
  const tabla = document.getElementById("tablaResultadosMetal");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  cotizacionMetales.items.forEach((item, indice) => {
    const metal = buscarMetalFisico(item.metalId);
    const presentacion = buscarPresentacionMetal(item.presentacionId);
    const fila = document.createElement("tr");

    fila.appendChild(crearCeldaMetal(indice + 1));
    fila.appendChild(crearCeldaMetal(metal ? metal.nombre : item.metalId));
    fila.appendChild(crearCeldaMetal(presentacion ? presentacion.nombre : item.presentacionId));
    fila.appendChild(crearCeldaMetal(item.codigoLote || ""));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.pesoGr, 2) + " gr"));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.leyPorcentaje, 2) + " %"));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.finosGr, 2) + " gr"));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.cotizacion, 2) + " " + item.unidadCotizacion));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.tipoCambio, 2)));
    fila.appendChild(crearCeldaMetal(formatearNumeroMetal(item.descuentoPorcentaje, 2) + " %"));
    fila.appendChild(crearCeldaMetal(formatearBobMetal(item.valorBob)));
    fila.appendChild(crearCeldaMetal(formatearUsdMetal(item.valorUsd)));
    fila.appendChild(crearCeldaMetal(formatearBobMetal(item.totalBob)));
    fila.appendChild(crearCeldaMetal(formatearUsdMetal(item.totalUsd)));
    fila.appendChild(crearCeldaMetal(formatearBobMetal(item.totalAl90Bob)));
    tabla.appendChild(fila);
  });
}

function mostrarTotalesMetales() {
  const totalBob = document.getElementById("totalBobMetal");
  const totalUsd = document.getElementById("totalUsdMetal");
  const totalAl90 = document.getElementById("totalAl90Metal");

  if (totalBob) {
    totalBob.textContent = formatearBobMetal(cotizacionMetales.totales.totalBob);
  }

  if (totalUsd) {
    totalUsd.textContent = formatearUsdMetal(cotizacionMetales.totales.totalUsd);
  }

  if (totalAl90) {
    totalAl90.textContent = formatearBobMetal(cotizacionMetales.totales.totalAl90Bob);
  }
}

function mostrarMetales() {
  mostrarDatosGeneralesMetales();
  mostrarResultadosMetales();
  mostrarTotalesMetales();
}
