function calcularRegalias() {
  liquidacion.regalias = [];

  const baseRegalias =
    liquidacion.valorPagable && liquidacion.valorPagable.length > 0
      ? liquidacion.valorPagable
      : liquidacion.valorBruto.map(item => ({
        ...item,
        valorPagableBob: item.valorBob
      }));

  baseRegalias.forEach(item => {
    const alicuota =
      typeof obtenerAlicuotaRegaliaConfiguracion === "function"
        ? obtenerAlicuotaRegaliaConfiguracion(item.elementoId)
        : 0;

    const montoBob = item.valorPagableBob * alicuota;

    liquidacion.regalias.push({
      elementoId: item.elementoId,
      nombre: item.nombre,
      simbolo: item.simbolo,
      alicuota: alicuota,
      baseBob: item.valorPagableBob,
      montoBob: montoBob
    });
  });
}
