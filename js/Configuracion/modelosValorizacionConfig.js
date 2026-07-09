function textoTipoMaterialConfiguracion(tipoMaterial) {
  if (tipoMaterial === "MINERAL") {
    return "Mineral";
  }

  if (tipoMaterial === "METAL_FISICO") {
    return "Metal fisico";
  }

  return tipoMaterial || "";
}

function separarListaConfiguracion(texto) {
  return String(texto || "")
    .split(",")
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
}

function unirListaConfiguracion(lista) {
  return Array.isArray(lista) ? lista.join(",") : "";
}

function obtenerValorConfiguracion(id) {
  const control = document.getElementById(id);
  return control ? control.value.trim() : "";
}

function escribirValorConfiguracion(id, valor) {
  const control = document.getElementById(id);

  if (control) {
    control.value = valor || "";
  }
}

function escribirCheckConfiguracion(id, valor) {
  const control = document.getElementById(id);

  if (control) {
    control.checked = valor !== false;
  }
}

function obtenerModelosConfigurablesEditables() {
  return typeof obtenerModelosValorizacionConfigurados === "function"
    ? obtenerModelosValorizacionConfigurados()
    : [];
}

function guardarModeloConfigurable(modelo) {
  const configurables = obtenerModelosConfigurablesEditables();
  const indice = configurables.findIndex(item => item.id === modelo.id);

  if (indice >= 0) {
    configurables[indice] = modelo;
  } else {
    configurables.push(modelo);
  }

  guardarModelosValorizacionConfigurados(configurables);
}

function cargarModeloEnFormulario(modelo) {
  escribirValorConfiguracion("modeloIdConfig", modelo.id);
  escribirValorConfiguracion("modeloNombreConfig", modelo.nombre);
  escribirValorConfiguracion("modeloTipoMaterialConfig", modelo.tipoMaterial);
  escribirValorConfiguracion("modeloPresentacionesConfig", unirListaConfiguracion(modelo.presentacionesCompatibles));
  escribirValorConfiguracion("modeloElementosPrincipalesConfig", unirListaConfiguracion(modelo.elementosPrincipales));
  escribirValorConfiguracion("modeloElementosOpcionalesConfig", unirListaConfiguracion(modelo.elementosOpcionales));
  escribirValorConfiguracion("modeloMetodoConfig", modelo.tipoOperacion || modelo.metodoValorizacion);
  escribirValorConfiguracion("modeloPlantillaConfig", modelo.plantillaId);
  escribirCheckConfiguracion("modeloActivoConfig", modelo.activo);
}

function limpiarModeloFormulario() {
  cargarModeloEnFormulario({
    id: "",
    nombre: "",
    tipoMaterial: "MINERAL",
    presentacionesCompatibles: [],
    elementosPrincipales: [],
    elementosOpcionales: [],
    tipoOperacion: "CONCENTRADO_MINERAL",
    plantillaId: "",
    activo: true
  });
}

function leerModeloFormulario() {
  const id = obtenerValorConfiguracion("modeloIdConfig").toUpperCase();
  const tipoMaterial = obtenerValorConfiguracion("modeloTipoMaterialConfig") || "MINERAL";
  const metodo =
    obtenerValorConfiguracion("modeloMetodoConfig") ||
    (tipoMaterial === "METAL_FISICO" ? "METAL_FISICO" : "CONCENTRADO_MINERAL");

  if (!id) {
    throw new Error("Ingrese el codigo del modelo.");
  }

  return {
    id: id,
    nombre: obtenerValorConfiguracion("modeloNombreConfig") || id,
    tipoMaterial: tipoMaterial,
    tipoOperacion: metodo,
    metodoValorizacion: metodo,
    presentacionesCompatibles: separarListaConfiguracion(
      obtenerValorConfiguracion("modeloPresentacionesConfig")
    ),
    elementosPrincipales: separarListaConfiguracion(
      obtenerValorConfiguracion("modeloElementosPrincipalesConfig")
    ),
    elementosOpcionales: separarListaConfiguracion(
      obtenerValorConfiguracion("modeloElementosOpcionalesConfig")
    ),
    plantillaId: obtenerValorConfiguracion("modeloPlantillaConfig"),
    activo: document.getElementById("modeloActivoConfig").checked
  };
}

function cambiarActivoModelo(modeloId) {
  const modelo = obtenerModelosValorizacion().find(item => item.id === modeloId);

  if (!modelo) {
    return;
  }

  guardarModeloConfigurable({ ...modelo, activo: !modelo.activo });
  mostrarModelosValorizacionConfiguracion();
  cargarSelectModeloDestinoElemento();
}

function mostrarModelosValorizacionConfiguracion() {
  const tabla = document.getElementById("tablaModelosValorizacion");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  obtenerModelosValorizacion().forEach(modelo => {
    const fila = document.createElement("tr");
    const botonEditar = document.createElement("button");
    const botonActivo = document.createElement("button");
    const accion = document.createElement("td");

    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", () => cargarModeloEnFormulario(modelo));

    botonActivo.type = "button";
    botonActivo.textContent = modelo.activo ? "Desactivar" : "Activar";
    botonActivo.addEventListener("click", () => cambiarActivoModelo(modelo.id));

    accion.appendChild(botonEditar);
    accion.appendChild(botonActivo);

    [
      modelo.id,
      modelo.nombre,
      textoTipoMaterialConfiguracion(modelo.tipoMaterial),
      modelo.tipoOperacion || modelo.metodoValorizacion || "",
      unirListaConfiguracion(modelo.elementosPrincipales),
      unirListaConfiguracion(modelo.presentacionesCompatibles),
      modelo.activo ? "Activo" : "Inactivo"
    ].forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });

    fila.appendChild(accion);
    tabla.appendChild(fila);
  });
}

function obtenerElementosConfigurablesEditables() {
  return typeof obtenerElementosConfigurados === "function"
    ? obtenerElementosConfigurados()
    : [];
}

function guardarElementoConfigurable(elemento) {
  const configurables = obtenerElementosConfigurablesEditables();
  const indice = configurables.findIndex(item => item.id === elemento.id);

  if (indice >= 0) {
    configurables[indice] = elemento;
  } else {
    configurables.push(elemento);
  }

  guardarElementosConfigurados(configurables);
  aplicarElementosConfigurados();
}

function cargarElementoEnFormulario(elemento) {
  escribirValorConfiguracion("elementoIdConfig", elemento.id);
  escribirValorConfiguracion("elementoNombreConfig", elemento.nombre);
  escribirValorConfiguracion("elementoSimboloConfig", elemento.simbolo);
  escribirValorConfiguracion("elementoUnidadLeyConfig", elemento.unidadLey);
  escribirValorConfiguracion("elementoUnidadCotizacionConfig", elemento.unidadCotizacion);
  escribirValorConfiguracion("elementoUnidadContenidoConfig", elemento.unidadContenido);
  escribirCheckConfiguracion("elementoControlMasaConfig", elemento.controlMasa === true);
  escribirValorConfiguracion("elementoClasificacionConfig", elemento.clasificacionEconomica);
  escribirCheckConfiguracion("elementoActivoConfig", elemento.activo);
}

function limpiarElementoFormulario() {
  cargarElementoEnFormulario({
    id: "",
    nombre: "",
    simbolo: "",
    unidadLey: "%",
    unidadCotizacion: "TM",
    unidadContenido: "kg",
    controlMasa: true,
    clasificacionEconomica: "",
    activo: true
  });
}

function leerElementoFormulario() {
  const id = obtenerValorConfiguracion("elementoIdConfig").toUpperCase();

  if (!id) {
    throw new Error("Ingrese el codigo del elemento.");
  }

  return {
    id: id,
    nombre: obtenerValorConfiguracion("elementoNombreConfig") || id,
    simbolo: obtenerValorConfiguracion("elementoSimboloConfig") || id,
    unidadLey: obtenerValorConfiguracion("elementoUnidadLeyConfig") || "%",
    unidadContenido: obtenerValorConfiguracion("elementoUnidadContenidoConfig") || "kg",
    unidadCotizacion: obtenerValorConfiguracion("elementoUnidadCotizacionConfig") || "TM",
    tipoCalculoContenido: "PORCENTAJE",
    tipoCalculoValor: "KG_A_LIBRAS",
    controlMasa: document.getElementById("elementoControlMasaConfig").checked,
    clasificacionEconomica: obtenerValorConfiguracion("elementoClasificacionConfig"),
    activo: document.getElementById("elementoActivoConfig").checked
  };
}

function prepararCotizacionYTablaElemento(elemento) {
  const configuracion = obtenerConfiguracionComercial();

  if (document.getElementById("elementoCrearCotizacionConfig").checked) {
    configuracion.cotizaciones[elemento.id] = {
      elementoId: elemento.id,
      nombre: elemento.nombre,
      simbolo: elemento.simbolo,
      precio: 0,
      valor: 0,
      unidad: elemento.unidadCotizacion,
      activa: true,
      fechaVigencia: obtenerFechaConfiguracionComercial(),
      fuente: "Manual",
      usuario: "Administrador",
      fechaActualizacion: obtenerFechaConfiguracionComercial()
    };
  }

  if (document.getElementById("elementoCrearTablaPagoConfig").checked) {
    configuracion.tablasPago[elemento.id] = crearTablaPagoFijo(
      elemento.id,
      elemento.unidadLey,
      100
    );
  }

  guardarConfiguracionComercial(configuracion);
}

function agregarElementoAModelo(elementoId) {
  const modeloId = obtenerValorConfiguracion("elementoModeloDestinoConfig");

  if (!modeloId) {
    return;
  }

  const modelo = obtenerModelosValorizacion().find(item => item.id === modeloId);

  if (!modelo) {
    return;
  }

  const principales = Array.isArray(modelo.elementosPrincipales)
    ? [...modelo.elementosPrincipales]
    : [];

  if (!principales.includes(elementoId)) {
    principales.push(elementoId);
  }

  guardarModeloConfigurable({ ...modelo, elementosPrincipales: principales });
}

function guardarElementoDesdeFormulario() {
  try {
    const elemento = leerElementoFormulario();
    guardarElementoConfigurable(elemento);
    prepararCotizacionYTablaElemento(elemento);
    agregarElementoAModelo(elemento.id);
    mostrarElementosConfiguracion();
    mostrarModelosValorizacionConfiguracion();
    cargarSelectModeloDestinoElemento();
    if (typeof mostrarConfiguracionComercial === "function") {
      mostrarConfiguracionComercial();
    }
  } catch (error) {
    alert(error.message);
  }
}

function guardarModeloDesdeFormulario() {
  try {
    guardarModeloConfigurable(leerModeloFormulario());
    mostrarModelosValorizacionConfiguracion();
    cargarSelectModeloDestinoElemento();
  } catch (error) {
    alert(error.message);
  }
}

function cambiarActivoElemento(elementoId) {
  const elemento = elementos.find(item => item.id === elementoId);

  if (!elemento) {
    return;
  }

  guardarElementoConfigurable({ ...elemento, activo: elemento.activo === false });
  mostrarElementosConfiguracion();
}

function mostrarElementosConfiguracion() {
  const tabla = document.getElementById("tablaElementosConfig");

  if (!tabla) {
    return;
  }

  tabla.innerHTML = "";

  elementos.forEach(elemento => {
    const fila = document.createElement("tr");
    const botonEditar = document.createElement("button");
    const botonActivo = document.createElement("button");
    const accion = document.createElement("td");

    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", () => cargarElementoEnFormulario(elemento));

    botonActivo.type = "button";
    botonActivo.textContent = elemento.activo === false ? "Activar" : "Desactivar";
    botonActivo.addEventListener("click", () => cambiarActivoElemento(elemento.id));

    accion.appendChild(botonEditar);
    accion.appendChild(botonActivo);

    [
      elemento.id,
      elemento.nombre,
      elemento.simbolo,
      elemento.unidadLey,
      elemento.unidadCotizacion,
      elemento.controlMasa ? "Si" : "No",
      elemento.activo === false ? "Inactivo" : "Activo"
    ].forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });

    fila.appendChild(accion);
    tabla.appendChild(fila);
  });
}

function cargarSelectModeloDestinoElemento() {
  const select = document.getElementById("elementoModeloDestinoConfig");

  if (!select) {
    return;
  }

  select.innerHTML = "";
  const vacio = document.createElement("option");
  vacio.value = "";
  vacio.textContent = "No agregar a modelo";
  select.appendChild(vacio);

  obtenerModelosValorizacion().forEach(modelo => {
    const option = document.createElement("option");
    option.value = modelo.id;
    option.textContent = modelo.nombre;
    select.appendChild(option);
  });
}

function configurarAccionesModelosElementos() {
  const acciones = [
    ["btnNuevoModeloValorizacion", limpiarModeloFormulario],
    ["btnGuardarModeloValorizacion", guardarModeloDesdeFormulario],
    ["btnNuevoElementoConfig", limpiarElementoFormulario],
    ["btnGuardarElementoConfig", guardarElementoDesdeFormulario]
  ];

  acciones.forEach(([id, manejador]) => {
    const boton = document.getElementById(id);

    if (boton) {
      boton.addEventListener("click", manejador);
    }
  });
}

mostrarModelosValorizacionConfiguracion();
mostrarElementosConfiguracion();
cargarSelectModeloDestinoElemento();
configurarAccionesModelosElementos();
