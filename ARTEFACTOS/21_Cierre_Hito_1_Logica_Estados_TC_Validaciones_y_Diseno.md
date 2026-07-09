# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 21_Cierre_Hito_1_Logica_Estados_TC_Validaciones_y_Diseno.md

## Objetivo

Corregir y consolidar la lógica funcional del Hito 1 antes de pasar al diseño visual final.

Este documento se enfoca en:

1. Definir botones y transiciones claras entre estados.
2. Corregir el manejo diario del tipo de cambio.
3. Validar coherencia comercial de metales y presentaciones.
4. Revisar la lógica completa del sistema.
5. Preparar el momento correcto para comenzar diseño visual.

---

# 1. Estados y botones del expediente

## Problema

Actualmente no queda claro cómo una cotización pendiente pasa a una compra terminada.

## Regla de negocio

Una cotización no se convierte directamente en compra terminada.

Debe seguir un flujo:

```text
BORRADOR
↓
COTIZACION_GENERADA
↓
EN_NEGOCIACION
↓
COTIZACION_ACEPTADA
↓
OPERACION_ABIERTA
↓
COMPRA_FINALIZADA
```

También puede ir a:

```text
COTIZACION_RECHAZADA
COTIZACION_VENCIDA
CANCELADA
```

---

## Botones requeridos

En la pantalla interna del expediente/cotización mostrar acciones según estado.

### Estado BORRADOR

Botones:

- Guardar cotización
- Calcular
- Generar proforma preliminar

### Estado COTIZACION_GENERADA

Botones:

- Marcar en negociación
- Aceptar cotización
- Rechazar cotización
- Marcar vencida
- Generar proforma

### Estado EN_NEGOCIACION

Botones:

- Aceptar cotización
- Rechazar cotización
- Marcar vencida
- Actualizar observación

### Estado COTIZACION_ACEPTADA

Botones:

- Abrir operación

### Estado OPERACION_ABIERTA

Botones:

- Registrar compra finalizada

### Estado COMPRA_FINALIZADA

Botones:

- Ver expediente
- Generar documentos
- Preparar siguiente fase

No permitir editar datos comerciales sensibles después de guardar oficialmente, salvo futuro flujo de corrección aprobado por administrador.

---

# 2. Tipo de cambio diario editable

## Problema

El tipo de cambio en Bolivia ya no debe tratarse como fijo.

Debe actualizarse diariamente desde Configuración Comercial.

## Requerimiento

En Configuración Comercial debe existir una sección clara:

```text
Tipo de cambio diario
```

Campos:

- Fecha de vigencia
- Dólar Oficial
- Dólar Comercial
- Fuente / observación
- Usuario que actualizó
- Fecha y hora de actualización

---

## Reglas

1. El administrador debe poder editar el tipo de cambio cada día.
2. El operador no debe editarlo desde la cotización.
3. La cotización debe usar el tipo de cambio vigente al momento de calcular.
4. El expediente debe guardar una copia del tipo de cambio usado.
5. Si no hay tipo de cambio configurado para el día, bloquear cálculo.
6. No permitir tipo de cambio igual a 0.

Mensaje sugerido:

```text
Debe configurar el tipo de cambio vigente antes de calcular.
```

---

# 3. Validación de metal y presentación

## Problema

No todas las presentaciones aplican a todos los metales.

Ejemplos:

- Oro puede venir en lingote, pepas, polvo o scrap.
- Plata normalmente puede venir en lingote o granalla.
- Estaño puede tener otras presentaciones.
- No siempre tiene sentido permitir cualquier combinación.

## Requerimiento

Crear una relación entre metal y presentaciones permitidas.

Ejemplo:

```javascript
AU: ["LINGOTE", "PEPAS", "POLVO", "SCRAP", "OTRO"]
AG: ["LINGOTE", "GRANALLA", "POLVO", "SCRAP", "OTRO"]
SN: ["LINGOTE", "GRANALLA", "OTRO"]
```

El formulario debe mostrar solo las presentaciones válidas para el metal seleccionado.

No debe permitir combinaciones inválidas.

---

# 4. Revisión lógica completa

Antes de cerrar el Hito 1 revisar:

## Cotizaciones

- ¿Se puede crear una cotización desde cero?
- ¿Se asigna expediente?
- ¿Se guarda correctamente?
- ¿Se puede reabrir?
- ¿Se puede aceptar/rechazar/vencer?

## Concentrados

- ¿El cálculo coincide con Excel?
- ¿Las tablas de pago se aplican solo a concentrados?
- ¿Las regalías se calculan correctamente?
- ¿El operador no ve reglas internas?
- ¿La proforma muestra el desglose técnico correcto?

## Metales físicos

- ¿Se agregan ítems correctamente?
- ¿La pureza sale de XRF?
- ¿Se calcula promedio?
- ¿Se calcula diferencia máxima?
- ¿Se sugieren estados?
- ¿Se aplican solo descuentos de metales, no tablas de pago?
- ¿Se filtran presentaciones por metal?
- ¿Se puede imprimir proforma?

## Configuración

- ¿Cotizaciones editables?
- ¿Tipo de cambio diario editable?
- ¿Tablas de pago editables?
- ¿Descuentos de metales separados?

## Historial

- ¿No duplica eventos?
- ¿Registra cambios reales?
- ¿Guarda usuario temporal?
- ¿Está preparado para usuario real?

## Proformas

- ¿No muestran campos vacíos?
- ¿No muestran información interna?
- ¿Tienen datos suficientes para el proveedor?
- ¿Se pueden imprimir?

---

# 5. Diseño visual

## Regla

No comenzar diseño visual completo hasta que el flujo lógico del Hito 1 esté estable.

Primero lógica.

Después diseño.

## Cuándo comenzar diseño

Comenzar diseño visual cuando:

- Concentrados funcione.
- Metales físicos funcione.
- Configuración comercial funcione.
- Proformas funcionen.
- Estados funcionen.
- No existan errores de consola.
- Las reglas de negocio estén validadas.

---

## Diseño permitido ahora

Sí se pueden hacer ajustes básicos de orden y claridad:

- mejorar títulos;
- separar secciones;
- alinear tablas;
- mejorar botones;
- usar textos claros;
- ocultar ruido visual.

No aplicar todavía diseño corporativo final, colores, layout avanzado o branding completo.

---

# Entregables

Al finalizar:

1. Confirmar flujo de botones por estado.
2. Confirmar transición hasta COMPRA_FINALIZADA.
3. Confirmar tipo de cambio diario editable.
4. Confirmar que el operador no puede modificar tipo de cambio.
5. Confirmar que cada expediente guarda el tipo de cambio usado.
6. Confirmar validación de metal/presentación.
7. Confirmar revisión lógica completa del Hito 1.
8. Indicar si el sistema ya está listo para iniciar diseño visual.
