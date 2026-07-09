# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 15_Corregir_Cotizaciones_Metales_Fisicos.md

## Objetivo

Corregir el módulo de **Metales Físicos** para que obtenga correctamente las cotizaciones de oro, plata, estaño y otros metales desde la misma fuente usada por el resto del sistema.

Actualmente el módulo de metales físicos funciona visualmente, pero no está recuperando correctamente las cotizaciones.

---

# Problema detectado

El módulo de metales físicos no está obteniendo la cotización correspondiente al metal seleccionado.

Ejemplo:

Si el ítem tiene:

```javascript
metalId: "AU"
```

el sistema debe buscar:

```javascript
cotizaciones["AU"]
```

y obtener:

```javascript
{
  valor: ...,
  unidad: "O.T.",
  activa: true
}
```

Si no encuentra la cotización, debe mostrar un error claro y no calcular con valor cero silenciosamente.

---

# Causa probable

El módulo de metales puede estar usando una estructura distinta a la del módulo de concentrados.

Posibles causas:

1. `cotizaciones.js` no contiene AU, AG o SN.
2. `metales.html` no carga `cotizaciones.js` antes de `js/Metales/datos.js`.
3. `calculos.js` está buscando cotizaciones con `.find()` cuando `cotizaciones` es un objeto.
4. Metales usa `metalId` pero cotizaciones usa otro identificador.
5. El módulo no está leyendo desde Configuración Comercial o localStorage.

---

# Revisión obligatoria

## 1. Revisar catalogos/cotizaciones.js

Confirmar que existan entradas para:

- AU
- AG
- SN
- PB
- ZN
- CU
- SB
- TA

Ejemplo esperado:

```javascript
const cotizaciones = {
  AU: { valor: 0, unidad: "O.T.", activa: true },
  AG: { valor: 51.3, unidad: "O.T.", activa: true },
  SN: { valor: 0, unidad: "TM", activa: true }
};
```

No inventar precios reales.

Si no hay valor real, usar 0 pero mostrar advertencia en la interfaz.

---

## 2. Revisar metales.html

Confirmar que el orden de carga sea correcto.

Debe cargar:

```html
<script src="catalogos/cotizaciones.js"></script>
<script src="catalogos/tipoCambio.js"></script>
```

antes de:

```html
<script src="js/Metales/datos.js"></script>
<script src="js/Metales/calculos.js"></script>
```

---

## 3. Revisar js/Metales/datos.js

Debe existir:

```javascript
cotizaciones: cotizaciones
```

dentro del objeto principal del módulo de metales.

Ejemplo:

```javascript
var cotizacionMetales = {
  items: [],
  tipoCambio: tipoCambio,
  cotizaciones: cotizaciones
};
```

---

## 4. Revisar js/Metales/calculos.js

Crear o corregir la función:

```javascript
function buscarCotizacionMetal(metalId) {
  if (!cotizacionMetales || !cotizacionMetales.cotizaciones) {
    return null;
  }

  return cotizacionMetales.cotizaciones[metalId] || null;
}
```

No usar `.find()` si `cotizaciones` es un objeto.

---

# Solución recomendada

Crear un servicio común de cotizaciones.

## Crear archivo

```text
js/Servicios/servicioCotizaciones.js
```

Debe contener:

```javascript
function obtenerCotizacionPorElemento(elementoId) {
  if (typeof cotizaciones === "undefined") {
    console.error("El catálogo de cotizaciones no está cargado.");
    return null;
  }

  if (!cotizaciones[elementoId]) {
    console.warn("No existe cotización configurada para:", elementoId);
    return null;
  }

  return cotizaciones[elementoId];
}
```

---

# Integración

Tanto el módulo de concentrados como el módulo de metales físicos deben usar:

```javascript
obtenerCotizacionPorElemento(elementoId)
```

para evitar duplicación de lógica.

---

# Validaciones requeridas

En metales físicos:

1. Si falta cotización, bloquear cálculo.
2. Si la cotización existe pero su valor es 0, mostrar advertencia clara.
3. No calcular silenciosamente con 0.
4. Mostrar mensaje entendible:

```text
Debe configurar la cotización de Oro (Au) antes de calcular.
```

---

# Reglas de unidad

El cálculo debe respetar la unidad de cotización:

## O.T.

```javascript
valorUsd = (finosGr / 31.1035) * cotizacion.valor
```

## GR

```javascript
valorUsd = finosGr * cotizacion.valor
```

## TM

```javascript
valorUsd = (finosGr / 1000000) * cotizacion.valor
```

---

# Restricciones

No modificar:

- motor de concentrados;
- fórmulas de concentrados;
- estructura del expediente;
- configuración comercial salvo que sea necesario para lectura de cotizaciones.

No inventar cotizaciones reales.

---

# Verificaciones esperadas

## Caso 1: Oro

Seleccionar:

```text
Metal: Oro
Presentación: Lingote
Peso: 1000 gr
Ley: 90%
```

Si AU tiene cotización mayor a 0, debe calcular.

Si AU tiene cotización 0, debe advertir.

---

## Caso 2: Plata

Seleccionar:

```text
Metal: Plata
Presentación: Granalla
```

Debe obtener:

```javascript
cotizaciones["AG"]
```

---

## Caso 3: Estaño

Seleccionar:

```text
Metal: Estaño
```

Debe obtener:

```javascript
cotizaciones["SN"]
```

Si no existe, debe mostrar error claro.

---

# Entregables

Al finalizar:

1. Indicar archivos modificados.
2. Confirmar que metales físicos obtiene cotizaciones correctamente.
3. Confirmar que AU, AG y SN están configurados.
4. Confirmar que no se usa `.find()` sobre objetos de cotización.
5. Confirmar que el sistema bloquea cálculo si falta cotización.
6. Confirmar que concentrados sigue funcionando.
