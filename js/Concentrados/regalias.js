function calcularRegalias() {
  liquidacion.regalias = [];

  liquidacion.valorBruto.forEach(item => {
    let alicuota = 0;

    if (item.elementoId === "PB") {
      alicuota = 0.03;
    }

    if (item.elementoId === "AG") {
      alicuota = 0.036;
    }

    const montoBob = item.valorBob * alicuota;

    liquidacion.regalias.push({
      elementoId: item.elementoId,
      nombre: item.nombre,
      simbolo: item.simbolo,
      alicuota: alicuota,
      montoBob: montoBob
    });
  });
}