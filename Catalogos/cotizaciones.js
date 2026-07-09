const cotizaciones =
  typeof obtenerCotizacionesConfiguracion === "function"
    ? obtenerCotizacionesConfiguracion()
    : {};

console.log("Cotizaciones cargadas:", cotizaciones);
