function calcularDescuentos() {
  const totalBaseDescuentos = (
    liquidacion.valorPagable && liquidacion.valorPagable.length > 0
      ? liquidacion.valorPagable
      : liquidacion.valorBruto.map(item => ({ valorPagableBob: item.valorBob }))
  ).reduce(
    (total, item) => total + item.valorPagableBob,
    0
  );

  const descuentosConfigurados =
    typeof obtenerDescuentosConfiguracion === "function"
      ? obtenerDescuentosConfiguracion()
      : [];

  liquidacion.descuentos = descuentosConfigurados.map(descuento => ({
    nombre: descuento.nombre,
    porcentaje: descuento.porcentaje,
    montoBob: totalBaseDescuentos * descuento.porcentaje
  }));
}
