function buscarLeyAnalisis(elementoId) {
  const analisis = liquidacion.analisis.find(item => item.elementoId === elementoId);
  return analisis ? Number(analisis.ley) || 0 : 0;
}

function calcularValorPagable() {
  liquidacion.valorPagable = [];

  liquidacion.valorBruto.forEach(item => {
    const ley = buscarLeyAnalisis(item.elementoId);
    const porcentajePago =
      typeof obtenerPorcentajePago === "function"
        ? obtenerPorcentajePago(item.elementoId, ley)
        : 1;

    liquidacion.valorPagable.push({
      elementoId: item.elementoId,
      nombre: item.nombre,
      simbolo: item.simbolo,
      ley: ley,
      valorBrutoBob: item.valorBob,
      porcentajePago: porcentajePago,
      valorPagableBob: item.valorBob * porcentajePago
    });
  });
}
