# Implementación de Expediente Comercial como entidad central

## Objetivo

Reorganizar la arquitectura del sistema para que toda cotización, aunque no se convierta en compra, quede registrada como un **Expediente Comercial**.

El objetivo es mejorar trazabilidad, seguimiento comercial, análisis histórico y toma de decisiones.

---

## Contexto

El sistema Manicone Document Generator nació como un generador de proformas mineras, pero debe evolucionar hacia un sistema de gestión comercial minera.

En la práctica, no toda cotización se convierte en operación.

Ejemplo:

- Una cooperativa ofrece 20 toneladas de concentrado de plomo.
- Se analiza la ley.
- Se calcula un precio.
- El proveedor rechaza el precio.
- No hay compra.

Aun así, esa información es valiosa y debe quedar registrada para análisis futuro.

---

## Principio central

Toda solicitud, propuesta o cotización debe crear un expediente único.

Una operación comercial solamente existe si la cotización es aceptada.

Por tanto:

```text
Cotización ≠ Operación
```

Pero ambas pertenecen al mismo expediente.

---

## Flujo comercial deseado

```text
Nueva cotización
        ↓
Crear expediente comercial
        ↓
Registrar proveedor / cooperativa
        ↓
Registrar material ofrecido
        ↓
Registrar peso estimado
        ↓
Registrar análisis químico
        ↓
Calcular precio
        ↓
Decisión comercial
        ├── Pendiente
        ├── Rechazada
        ├── Vencida
        └── Aceptada
                ↓
        Abrir operación comercial
```

---

## Estados del expediente

Agregar soporte conceptual para estos estados:

```javascript
const ESTADOS_EXPEDIENTE = {
  BORRADOR: "BORRADOR",
  COTIZACION_GENERADA: "COTIZACION_GENERADA",
  EN_NEGOCIACION: "EN_NEGOCIACION",
  COTIZACION_ACEPTADA: "COTIZACION_ACEPTADA",
  COTIZACION_RECHAZADA: "COTIZACION_RECHAZADA",
  COTIZACION_VENCIDA: "COTIZACION_VENCIDA",
  OPERACION_ABIERTA: "OPERACION_ABIERTA",
  OPERACION_CERRADA: "OPERACION_CERRADA",
  CANCELADA: "CANCELADA"
};
```

No es necesario implementar toda la máquina de estados todavía, pero sí preparar la estructura.

---

## Modelo sugerido de Expediente Comercial

Crear una estructura base similar a:

```javascript
const expedienteComercial = {
  codigo: "EXP-2026-000001",
  estado: "BORRADOR",

  tipoExpediente: "COMPRA_MINERAL",

  proveedorId: "",
  compradorId: null,

  tipoMaterial: "",
  plantillaId: "",

  datosOferta: {
    pesoEstimadoKg: 0,
    condicionEntrega: "",
    ubicacionMaterial: "",
    observaciones: ""
  },

  pesos: {
    pesoBrutoKg: 0,
    taraKg: 0,
    humedadPorcentaje: 0,
    humedadKg: 0,
    pesoNetoHumedoKg: 0,
    pesoNetoSecoKg: 0
  },

  analisis: [],

  cotizacionesUsadas: {},

  tipoCambioUsado: {},

  resultados: {
    valorBrutoBob: 0,
    regaliasBob: 0,
    descuentosBob: 0,
    liquidoPagableBob: 0
  },

  negociacion: {
    precioCalculadoBob: 0,
    precioSolicitadoBob: 0,
    precioAcordadoBob: 0,
    motivoRechazo: "",
    observaciones: ""
  },

  documentos: [],

  historial: []
};
```

---

## Diferencia entre expediente, cotización y operación

### Expediente

Es el registro maestro.

Existe desde el primer contacto o primera cotización.

Puede terminar aceptado, rechazado, vencido o convertido en operación.

### Cotización

Es una etapa del expediente.

Contiene cálculo de precio, análisis, datos del proveedor y condiciones.

Puede generar una proforma.

### Operación

Solo existe si la cotización es aceptada.

Representa una compra o venta real en ejecución.

---

## Qué datos deben guardarse aunque la cotización sea rechazada

Para fines de inteligencia comercial, guardar como mínimo:

- Código del expediente
- Fecha
- Proveedor / cooperativa
- Material ofrecido
- Plantilla usada
- Peso estimado
- Condición de entrega
- Análisis químico
- Cotizaciones usadas
- Tipo de cambio usado
- Precio calculado
- Precio solicitado por el proveedor
- Estado
- Motivo de rechazo
- Observaciones

---

## Reportes futuros que debe permitir esta estructura

La arquitectura debe permitir en el futuro reportes como:

```text
Por cooperativa:
- Cotizaciones recibidas
- Cotizaciones aceptadas
- Cotizaciones rechazadas
- Ley promedio de Pb
- Ley promedio de Ag
- Precio promedio solicitado
- Motivo frecuente de rechazo
- Última cotización
```

También:

```text
Por mineral:
- Cantidad de ofertas recibidas
- Ley promedio
- Tasa de aceptación
- Peso total ofertado
- Peso total comprado
```

---

## Cambios solicitados en el proyecto

### 1. Crear módulo o carpeta para expedientes

Crear una carpeta sugerida:

```text
js/Expedientes/
```

Archivos sugeridos:

```text
modeloExpediente.js
estadosExpediente.js
expedientes.js
```

No implementar base de datos todavía.

Solo preparar modelo y estructura.

---

### 2. Crear modeloExpediente.js

Debe contener una función para crear un expediente base.

Ejemplo:

```javascript
function crearExpedienteBase() {
  return {
    codigo: generarCodigoExpediente(),
    estado: "BORRADOR",
    tipoExpediente: "COMPRA_MINERAL",
    proveedorId: "",
    compradorId: null,
    tipoMaterial: "",
    plantillaId: "",
    datosOferta: {
      pesoEstimadoKg: 0,
      condicionEntrega: "",
      ubicacionMaterial: "",
      observaciones: ""
    },
    pesos: {
      pesoBrutoKg: 0,
      taraKg: 0,
      humedadPorcentaje: 0,
      humedadKg: 0,
      pesoNetoHumedoKg: 0,
      pesoNetoSecoKg: 0
    },
    analisis: [],
    cotizacionesUsadas: {},
    tipoCambioUsado: {},
    resultados: {},
    negociacion: {
      precioCalculadoBob: 0,
      precioSolicitadoBob: 0,
      precioAcordadoBob: 0,
      motivoRechazo: "",
      observaciones: ""
    },
    documentos: [],
    historial: []
  };
}
```

---

### 3. Crear función generarCodigoExpediente()

Por ahora puede ser simple.

Ejemplo:

```javascript
function generarCodigoExpediente() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return "EXP-" + year + "-" + random;
}
```

En el futuro esto se reemplazará por numeración desde base de datos.

---

### 4. No reemplazar todavía liquidacion

El módulo de concentrados actualmente funciona con `liquidacion`.

No romperlo.

Por ahora, el expediente debe coexistir con liquidacion.

La migración debe ser gradual.

---

### 5. Nueva cotización debe crear expediente

Cuando el usuario inicie una nueva cotización, el sistema debe crear un expediente base y asociarle la plantilla seleccionada.

Por ahora puede guardarse temporalmente en localStorage.

Ejemplo:

```javascript
localStorage.setItem("expedienteActual", JSON.stringify(expediente));
```

---

### 6. En concentrados, leer expediente si existe

El módulo de concentrados debe poder leer el expediente desde localStorage.

Si existe, usar sus datos.

Si no existe, seguir funcionando con los datos de prueba actuales.

Esto evita romper el desarrollo actual.

---

### 7. Preparar estados de decisión comercial

Preparar funciones futuras:

```javascript
marcarCotizacionAceptada()
marcarCotizacionRechazada()
marcarCotizacionVencida()
abrirOperacionDesdeCotizacion()
```

No implementar toda la lógica todavía.

Solo preparar nombres y estructura si corresponde.

---

## Restricciones

No implementar base de datos.

No implementar autenticación.

No implementar reportes todavía.

No eliminar `liquidacion`.

No romper el módulo de concentrados.

No modificar fórmulas de cálculo.

No modificar la lógica del formulario dinámico salvo que sea necesario para leer el expediente.

---

## Verificaciones esperadas

Al finalizar:

- El sistema debe seguir cargando sin errores.
- La nueva estructura de expedientes debe existir.
- Nueva cotización debe poder crear un expediente base.
- Concentrados debe seguir funcionando como antes.
- El expediente debe tener código único.
- El expediente debe quedar guardado temporalmente en localStorage.
- No debe haber errores en consola.

---

## Entregables

Al terminar:

1. Indicar archivos creados.
2. Indicar archivos modificados.
3. Explicar cómo se crea el expediente.
4. Explicar cómo se relaciona expediente con cotización.
5. Confirmar que liquidacion sigue funcionando.
6. Confirmar que el sistema queda preparado para guardar cotizaciones rechazadas en el futuro.
7. No avanzar con base de datos ni reportes sin nueva instrucción.
