function calcularContenidoFino() {
  liquidacion.contenidoFino = [];

  liquidacion.analisis.forEach(item => {
    const elemento = buscarElemento(item.elementoId);

    if (!elemento) {
      return;
    }

    const formula =
      reglasCalculo.contenidoFino[elemento.tipoCalculoContenido];

    if (!formula) {
      console.error("No existe fórmula de contenido fino para:", elemento.id);
      return;
    }

    const cantidadFina = formula(
      liquidacion.pesos.pesoNetoSecoKg,
      item.ley
    );

    liquidacion.contenidoFino.push({
      elementoId: elemento.id,
      nombre: elemento.nombre,
      simbolo: elemento.simbolo,
      cantidad: cantidadFina,
      unidad: elemento.unidadContenido
    });
  });
}