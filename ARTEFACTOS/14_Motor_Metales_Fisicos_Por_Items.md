# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 14_Motor_Metales_Fisicos_Por_Items.md

## Objetivo

Implementar el módulo inicial de **Metales Físicos** para cotizar compras de oro, plata, estaño y otros metales, utilizando una lógica distinta a la de concentrados minerales.

En metales físicos, la proforma debe trabajar por **ítems o filas independientes**, porque un mismo proveedor puede traer varios lotes, distintas presentaciones o incluso distintos metales en una sola cotización.

Ejemplo:

- Fila 1: Oro en lingote.
- Fila 2: Oro en pepas.
- Fila 3: Plata en granalla.
- Fila 4: Otro lote de oro con diferente ley.

---

# Contexto

Actualmente el sistema ya tiene un módulo de concentrados minerales.

Ese módulo trabaja con:

- peso bruto;
- tara;
- humedad;
- análisis químico;
- contenido fino;
- valor bruto;
- regalías;
- descuentos;
- líquido pagable.

Sin embargo, la compra de metales físicos funciona diferente.

En metales físicos se trabaja con filas o ítems donde cada entrada puede tener:

- metal;
- presentación;
- peso en gramos;
- ley o pureza;
- finos en gramos;
- cotización;
- tipo de cambio;
- descuento;
- precio;
- total.

No se deben copiar directamente las fórmulas de concentrados.

---

# Flujo esperado

El flujo será:

```text
Nueva cotización
↓
Tipo de material: Metal físico
↓
Presentación / modelo de valorización
↓
Pantalla de metales físicos
↓
Agregar ítems
↓
Calcular
↓
Guardar cotización
↓
Generar proforma
```

---

# Principio clave

El módulo de metales físicos debe trabajar por **itemsCompraMetal**.

Cada fila es independiente.

Ejemplo de estructura:

```javascript
itemsCompraMetal = [
  {
    metalId: "AU",
    presentacionId: "LINGOTE",
    pesoGr: 1200,
    leyPorcentaje: 98.5,
    finosGr: 1182,
    cotizacion: 0,
    unidadCotizacion: "O.T.",
    tipoCambio: 6.96,
    descuentoPorcentaje: 4,
    valorUsd: 0,
    valorBob: 0,
    totalUsd: 0,
    totalBob: 0
  }
];
```

---

# Archivos a crear

Crear la siguiente estructura:

```text
catalogos/
├── metalesFisicos.js
├── presentacionesMetal.js

js/
└── Metales/
    ├── datos.js
    ├── calculos.js
    ├── formulario.js
    ├── mostrar.js
    └── metales.js

metales.html
```

Si ya existe `lingotes.html`, no eliminarlo todavía. Puede redirigir o quedar obsoleto después.

---

# 1. Catálogo de metales físicos

Crear:

```text
catalogos/metalesFisicos.js
```

Debe contener al menos:

```javascript
const metalesFisicos = [
  {
    id: "AU",
    nombre: "Oro",
    simbolo: "Au",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "O.T.",
    activo: true
  },
  {
    id: "AG",
    nombre: "Plata",
    simbolo: "Ag",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "O.T.",
    activo: true
  },
  {
    id: "SN",
    nombre: "Estaño",
    simbolo: "Sn",
    unidadPeso: "gr",
    unidadLey: "%",
    unidadFina: "gr",
    unidadCotizacion: "TM",
    activo: true
  }
];
```

No inventar cotizaciones reales.

---

# 2. Catálogo de presentaciones

Crear:

```text
catalogos/presentacionesMetal.js
```

Debe contener:

```javascript
const presentacionesMetal = [
  {
    id: "LINGOTE",
    nombre: "Lingote",
    descuentoDefault: 4,
    activo: true
  },
  {
    id: "PEPAS",
    nombre: "Pepas",
    descuentoDefault: 6,
    activo: true
  },
  {
    id: "GRANALLA",
    nombre: "Granalla",
    descuentoDefault: 5,
    activo: true
  },
  {
    id: "POLVO",
    nombre: "Polvo",
    descuentoDefault: 8,
    activo: true
  },
  {
    id: "SCRAP",
    nombre: "Scrap",
    descuentoDefault: 10,
    activo: true
  },
  {
    id: "OTRO",
    nombre: "Otro",
    descuentoDefault: 0,
    activo: true
  }
];
```

El descuento default puede ser editable posteriormente desde Configuración.

---

# 3. Datos base del módulo

Crear:

```text
js/Metales/datos.js
```

Debe contener una estructura base:

```javascript
var cotizacionMetales = {
  codigo: "",
  fecha: "",
  expedienteId: "",
  proveedorId: "",
  tipoMaterial: "METAL_FISICO",

  items: [],

  tipoCambio: tipoCambio,
  cotizaciones: cotizaciones,

  totales: {
    totalUsd: 0,
    totalBob: 0,
    totalAl90Bob: 0
  }
};
```

Debe poder leer el expediente actual desde localStorage si existe.

---

# 4. Formulario dinámico

Crear:

```text
js/Metales/formulario.js
```

Debe permitir:

- agregar ítem;
- eliminar ítem;
- seleccionar metal;
- seleccionar presentación;
- ingresar peso en gramos;
- ingresar ley/pureza;
- mostrar descuento sugerido según presentación;
- permitir editar descuento.

Debe existir un botón:

```text
+ Agregar ítem
```

Cada ítem debe generarse dinámicamente.

No debe haber filas vacías fijas como en Excel.

---

# 5. Fórmulas iniciales

Crear:

```text
js/Metales/calculos.js
```

## Contenido fino

```javascript
finosGr = pesoGr * (leyPorcentaje / 100)
```

## Valor USD

Si la cotización está en onza troy:

```javascript
valorUsd = (finosGr / 31.1035) * cotizacion
```

Si la cotización está en gramo:

```javascript
valorUsd = finosGr * cotizacion
```

Si la cotización está en tonelada métrica:

```javascript
valorUsd = (finosGr / 1000000) * cotizacion
```

## Valor BOB

```javascript
valorBob = valorUsd * tipoCambio
```

## Total con descuento

```javascript
totalBob = valorBob * (1 - descuentoPorcentaje / 100)
```

También calcular total USD si corresponde.

---

# 6. Total al 90%

La tabla original tiene una columna llamada:

```text
al 90%
```

Preparar el cálculo como campo opcional:

```javascript
totalAl90Bob = valorBob * 0.90
```

No usarlo como regla principal hasta confirmar su función exacta.

Debe mostrarse como dato auxiliar si la tabla original lo requiere.

---

# 7. Mostrar resultados

Crear:

```text
js/Metales/mostrar.js
```

Debe mostrar una tabla con:

- N°
- Metal
- Presentación
- Peso gr
- Ley
- Finos gr
- Cotización
- T/C
- Descuento
- Precio Bs
- Precio $us
- Total Bs
- Total $us
- Al 90%

La tabla debe mostrar solo ítems reales.

No mostrar filas vacías.

---

# 8. Archivo principal

Crear:

```text
js/Metales/metales.js
```

Debe coordinar:

1. Inicializar datos.
2. Generar formulario.
3. Leer formulario.
4. Calcular.
5. Mostrar resultados.
6. Guardar en expediente si existe.

---

# 9. Página metales.html

Crear:

```text
metales.html
```

Debe cargar:

```html
<script src="catalogos/conversiones.js"></script>
<script src="catalogos/cotizaciones.js"></script>
<script src="catalogos/tipoCambio.js"></script>
<script src="catalogos/metalesFisicos.js"></script>
<script src="catalogos/presentacionesMetal.js"></script>

<script src="js/Expedientes/estadosExpediente.js"></script>
<script src="js/Expedientes/modeloExpediente.js"></script>
<script src="js/Expedientes/expedientes.js"></script>

<script src="js/Metales/datos.js"></script>
<script src="js/Metales/calculos.js"></script>
<script src="js/Metales/formulario.js"></script>
<script src="js/Metales/mostrar.js"></script>
<script src="js/Metales/metales.js"></script>
```

Debe tener secciones:

- Datos generales.
- Ingreso de ítems.
- Resultados.
- Totales.
- Acciones.

---

# 10. Integración con nueva cotización

Cuando el usuario seleccione:

```text
Tipo de material: Metal físico
```

el sistema debe redirigir a:

```text
metales.html
```

No a `concentrados.html`.

Si todavía existe `lingotes.html`, puede dejarse como página obsoleta o redireccionar a `metales.html`.

---

# 11. Validaciones

Agregar validaciones:

- Peso mayor a 0.
- Ley mayor a 0.
- Ley no mayor a 100.
- Descuento no menor a 0.
- Descuento no mayor a 100.
- Cotización existente para el metal.
- Tipo de cambio mayor a 0.

Si falta cotización, mostrar error claro.

---

# 12. Formato visual

Usar las funciones de formato existentes.

Ejemplos:

```text
1.200,00 gr
98,50 %
Bs 331.353,81
USD 47.000,00
```

---

# 13. Restricciones

No modificar el motor de concentrados.

No modificar fórmulas de concentrados.

No eliminar `lingotes.html` todavía.

No mezclar cálculos de metales con cálculos de concentrados.

No usar filas vacías fijas como en Excel.

---

# 14. Verificaciones esperadas

## Caso 1

Agregar:

```text
Oro
Lingote
Peso: 1000 gr
Ley: 90%
Descuento: 4%
```

Debe calcular:

- finos en gramos;
- valor USD;
- valor BOB;
- total con descuento.

## Caso 2

Agregar dos ítems:

```text
Oro Lingote
Oro Pepas
```

Debe sumar totales.

## Caso 3

Agregar oro y plata.

Debe permitir distintos metales en la misma cotización.

## Caso 4

Intentar calcular con tipo de cambio 0.

Debe bloquear cálculo.

---

# 15. Entregables

Al finalizar:

1. Indicar archivos creados.
2. Indicar archivos modificados.
3. Confirmar que metales funciona por ítems.
4. Confirmar que se pueden agregar varios metales en una cotización.
5. Confirmar que se pueden agregar varias presentaciones.
6. Confirmar que no se rompió concentrados.
7. Confirmar que el sistema queda preparado para futura proforma imprimible de metales.
