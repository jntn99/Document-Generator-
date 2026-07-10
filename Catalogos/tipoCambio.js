const tipoCambio =
  typeof obtenerTipoCambioConfiguracion === "function"
    ? obtenerTipoCambioConfiguracion()
    : { vigente: 0, dolarOF: 0, dolarCOM: 0 };

console.log("Tipo de cambio cargado:", tipoCambio);
