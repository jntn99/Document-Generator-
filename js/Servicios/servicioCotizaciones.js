function obtenerNombreElementoCotizacion(elementoId) {
  if (typeof buscarElemento === "function") {
    const elemento = buscarElemento(elementoId);

    if (elemento) {
      return elemento.nombre + " (" + elemento.simbolo + ")";
    }
  }

  if (typeof buscarMetalFisico === "function") {
    const metal = buscarMetalFisico(elementoId);

    if (metal) {
      return metal.nombre + " (" + metal.simbolo + ")";
    }
  }

  return elementoId;
}

function obtenerCotizacionPorElemento(elementoId) {
  if (typeof cotizaciones === "undefined") {
    console.error("El catalogo de cotizaciones no esta cargado.");
    return null;
  }

  if (!cotizaciones[elementoId]) {
    console.warn("No existe cotizacion configurada para:", elementoId);
    return null;
  }

  if (cotizaciones[elementoId].activa === false) {
    console.warn("La cotizacion esta inactiva para:", elementoId);
    return null;
  }

  return cotizaciones[elementoId];
}

function obtenerMensajeCotizacionFaltante(elementoId) {
  return (
    "Debe configurar la cotizacion de " +
    obtenerNombreElementoCotizacion(elementoId) +
    " antes de calcular."
  );
}
