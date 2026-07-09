const tablasPago =
  typeof obtenerTablasPagoConfiguracion === "function"
    ? obtenerTablasPagoConfiguracion()
    : {};

console.log("Tablas de pago cargadas:", tablasPago);
