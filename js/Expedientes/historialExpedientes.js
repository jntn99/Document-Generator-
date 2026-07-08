const FILTRO_TODOS = "TODOS";
const FILTRO_PENDIENTES = "PENDIENTES";

const ESTADOS_PENDIENTES = [
  ESTADOS_EXPEDIENTE.BORRADOR,
  ESTADOS_EXPEDIENTE.COTIZACION_GENERADA,
  ESTADOS_EXPEDIENTE.EN_NEGOCIACION
];

function obtenerNombreEstado(estado) {
  const nombres = {
    BORRADOR: "Pendiente",
    COTIZACION_GENERADA: "Pendiente",
    EN_NEGOCIACION: "Pendiente",
    COTIZACION_ACEPTADA: "Aceptado",
    COTIZACION_RECHAZADA: "Rechazado",
    COTIZACION_VENCIDA: "Vencido",
    OPERACION_ABIERTA: "Operacion abierta",
    OPERACION_CERRADA: "Operacion cerrada",
    CANCELADA: "Cancelada"
  };

  return nombres[estado] || "Pendiente";
}

function buscarProveedorExpediente(expediente) {
  if (typeof cooperativas === "undefined") {
    return null;
  }

  return cooperativas.find(proveedor => proveedor.id === expediente.proveedorId);
}

function buscarMaterialExpediente(expediente) {
  if (typeof concentrados === "undefined") {
    return null;
  }

  return concentrados.find(material => material.id === expediente.materialId);
}

function obtenerTextoProveedor(expediente) {
  const proveedor = buscarProveedorExpediente(expediente);

  if (proveedor) {
    return proveedor.nombre;
  }

  return expediente.proveedorId || "Sin proveedor";
}

function obtenerTextoMaterial(expediente) {
  const material = buscarMaterialExpediente(expediente);

  if (material) {
    return material.nombre;
  }

  return expediente.materialId || expediente.tipoMaterial || "Sin material";
}

function obtenerTextoModelo(expediente) {
  if (typeof buscarModeloValorizacion === "function" && expediente.modeloValorizacionId) {
    const modelo = buscarModeloValorizacion(expediente.modeloValorizacionId);

    if (modelo) {
      return modelo.nombre;
    }
  }

  return expediente.modeloValorizacionId || expediente.plantillaId || "Sin modelo";
}

function obtenerFechaHistorial(expediente) {
  if (expediente.historial && expediente.historial.length > 0) {
    const ultimoMovimiento = expediente.historial[expediente.historial.length - 1];
    return ultimoMovimiento.fecha || expediente.fechaCreacion;
  }

  return expediente.fechaCreacion;
}

function formatearFechaHistorial(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  const fechaParseada = new Date(fecha);

  if (Number.isNaN(fechaParseada.getTime())) {
    return fecha;
  }

  return fechaParseada.toLocaleDateString("es-BO");
}

function expedienteCoincideConFiltro(expediente, filtroEstado) {
  const estado = expediente.estado || ESTADOS_EXPEDIENTE.BORRADOR;

  if (filtroEstado === FILTRO_TODOS) {
    return true;
  }

  if (filtroEstado === FILTRO_PENDIENTES) {
    return ESTADOS_PENDIENTES.includes(estado);
  }

  return estado === filtroEstado;
}

function normalizarTextoHistorial(texto) {
  return String(texto || "").toLowerCase().trim();
}

function expedienteCoincideConBusqueda(expediente, busqueda) {
  const textoBusqueda = normalizarTextoHistorial(busqueda);

  if (!textoBusqueda) {
    return true;
  }

  const campos = [
    expediente.codigo,
    expediente.proveedorId,
    obtenerTextoProveedor(expediente),
    expediente.materialId,
    obtenerTextoMaterial(expediente),
    expediente.tipoMaterial
  ];

  return campos.some(campo =>
    normalizarTextoHistorial(campo).includes(textoBusqueda)
  );
}

function obtenerExpedientesFiltrados() {
  const campoBusqueda = document.getElementById("buscarExpediente");
  const selectorEstado = document.getElementById("filtroEstado");
  const busqueda = campoBusqueda ? campoBusqueda.value : "";
  const filtroEstado = selectorEstado ? selectorEstado.value : FILTRO_TODOS;

  return obtenerHistorialExpedientes()
    .filter(expediente => expedienteCoincideConFiltro(expediente, filtroEstado))
    .filter(expediente => expedienteCoincideConBusqueda(expediente, busqueda))
    .sort((a, b) => {
      const fechaA = new Date(obtenerFechaHistorial(a) || 0).getTime();
      const fechaB = new Date(obtenerFechaHistorial(b) || 0).getTime();
      return fechaB - fechaA;
    });
}

function crearCeldaHistorial(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function obtenerRutaExpediente(expediente) {
  if (expediente.tipoMaterial === "METAL_FISICO") {
    return "lingotes.html";
  }

  return "concentrados.html";
}

function abrirExpedienteDesdeHistorial(codigo) {
  const expediente = obtenerHistorialExpedientes().find(item => item.codigo === codigo);

  if (!expediente) {
    alert("No se encontro el expediente seleccionado.");
    return;
  }

  localStorage.setItem(CLAVE_EXPEDIENTE_ACTUAL, JSON.stringify(expediente));

  if (expediente.plantillaId) {
    localStorage.setItem("plantillaSeleccionadaId", expediente.plantillaId);
  }

  window.location.href = obtenerRutaExpediente(expediente);
}

function crearFilaHistorial(expediente) {
  const fila = document.createElement("tr");
  const botonAbrir = document.createElement("button");
  const celdaAccion = document.createElement("td");

  botonAbrir.type = "button";
  botonAbrir.textContent = "Abrir";
  botonAbrir.addEventListener("click", () => {
    abrirExpedienteDesdeHistorial(expediente.codigo);
  });

  celdaAccion.appendChild(botonAbrir);

  fila.appendChild(crearCeldaHistorial(expediente.codigo || "Sin codigo"));
  fila.appendChild(crearCeldaHistorial(obtenerTextoProveedor(expediente)));
  fila.appendChild(crearCeldaHistorial(obtenerTextoMaterial(expediente)));
  fila.appendChild(crearCeldaHistorial(obtenerTextoModelo(expediente)));
  fila.appendChild(crearCeldaHistorial(obtenerNombreEstado(expediente.estado)));
  fila.appendChild(crearCeldaHistorial(formatearFechaHistorial(obtenerFechaHistorial(expediente))));
  fila.appendChild(celdaAccion);

  return fila;
}

function renderizarHistorialExpedientes() {
  const cuerpoTabla = document.getElementById("tablaHistorialExpedientes");
  const mensaje = document.getElementById("mensajeHistorial");
  const expedientes = obtenerExpedientesFiltrados();

  if (!cuerpoTabla) {
    return;
  }

  cuerpoTabla.innerHTML = "";

  if (mensaje) {
    mensaje.textContent = expedientes.length
      ? `${expedientes.length} expediente(s) encontrado(s).`
      : "No hay expedientes para los filtros seleccionados.";
  }

  expedientes.forEach(expediente => {
    cuerpoTabla.appendChild(crearFilaHistorial(expediente));
  });
}

function configurarHistorialExpedientes() {
  const campoBusqueda = document.getElementById("buscarExpediente");
  const selectorEstado = document.getElementById("filtroEstado");

  if (campoBusqueda) {
    campoBusqueda.addEventListener("input", renderizarHistorialExpedientes);
  }

  if (selectorEstado) {
    selectorEstado.addEventListener("change", renderizarHistorialExpedientes);
  }

  renderizarHistorialExpedientes();
}

document.addEventListener("DOMContentLoaded", configurarHistorialExpedientes);
