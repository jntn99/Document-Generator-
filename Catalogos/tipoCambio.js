const tipoCambio =
  typeof obtenerTipoCambioConfiguracion === "function"
    ? obtenerTipoCambioConfiguracion()
    : { dolarOF: 0, dolarCOM: 0 };

console.log("Tipo de cambio cargado:", tipoCambio);
