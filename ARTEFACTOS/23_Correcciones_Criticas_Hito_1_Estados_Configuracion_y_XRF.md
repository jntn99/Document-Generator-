# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 23_Correcciones_Criticas_Hito_1_Estados_Configuracion_y_XRF.md

## Objetivo

Corregir fallas críticas detectadas durante la revisión del Hito 1.

Estas fallas impiden cerrar correctamente el Núcleo Comercial del ERP.

---

# Problemas detectados

## 1. No existen acciones claras para cambiar estado del expediente

Actualmente no existe una opción visible para cambiar una cotización/expediente de:

- Pendiente
- Aceptado
- Rechazado
- Vencido
- Operación abierta
- Compra finalizada

Esto impide controlar el flujo comercial.

---

## 2. No existe configuración de Modelos de Valorización

En Configuración no existe una pantalla para:

- Ver modelos de valorización.
- Crear nuevos modelos.
- Editar modelos existentes.
- Activar/desactivar modelos.

Esto impide que el sistema sea realmente configurable.

---

## 3. No se pueden agregar nuevos minerales correctamente

El sistema debe permitir agregar nuevos elementos/minerales y que se vinculen con:

- Cotizaciones.
- Modelos de valorización.
- Tablas de pago si aplica.
- Presentaciones si corresponde.
- Cálculos.
- Validaciones.

Actualmente esto no está completamente resuelto.

---

## 4. Tipo de cambio para metales físicos

En metales físicos debe existir una forma clara de usar o ajustar el tipo de cambio aplicado.

El tipo de cambio base debe venir desde Configuración Comercial, pero en el formulario de metales físicos debe verse claramente qué tipo de cambio se está usando.

Si se permite modificación directa, debe quedar registrada y posteriormente deberá requerir permisos de administrador.

Por ahora:

- Mostrar tipo de cambio usado.
- Permitir editarlo temporalmente en el formulario si el flujo actual lo requiere.
- Guardar el tipo de cambio usado en el expediente.
- No permitir calcular con tipo de cambio 0.

---

## 5. Lecturas XRF no se actualizan en tiempo real

Cuando el usuario ingresa lecturas XRF, el sistema debe actualizar inmediatamente:

- promedio de pureza;
- diferencia máxima;
- estado sugerido;
- total calculado si corresponde.

No debe requerir demasiados clics ni recalcular manualmente todo.

---

# Corrección 1: Botones de estado

Agregar acciones visibles según estado del expediente.

## Estado BORRADOR

Botones:

- Guardar cotización
- Generar proforma preliminar

## Estado COTIZACION_GENERADA / PENDIENTE

Botones:

- Marcar en negociación
- Aceptar cotización
- Rechazar cotización
- Marcar vencida
- Generar proforma

## Estado EN_NEGOCIACION

Botones:

- Aceptar cotización
- Rechazar cotización
- Marcar vencida
- Guardar observación de negociación

## Estado COTIZACION_ACEPTADA

Botones:

- Abrir operación

## Estado OPERACION_ABIERTA

Botones:

- Registrar compra finalizada

## Estado COMPRA_FINALIZADA

Botones:

- Ver expediente
- Generar documentos

---

# Corrección 2: Configuración de Modelos de Valorización

Crear pantalla:

```text
Configuración
└── Modelos de Valorización
```

Debe permitir como mínimo:

- Listar modelos.
- Crear modelo.
- Editar modelo.
- Activar/desactivar modelo.

Campos mínimos:

- Código.
- Nombre visible.
- Tipo de material.
- Presentaciones compatibles.
- Elementos principales.
- Elementos opcionales.
- Método de valorización.
- Plantilla técnica interna si todavía se usa.
- Activo.

No romper modelos existentes.

---

# Corrección 3: Agregar nuevos minerales / elementos

Crear o mejorar pantalla:

```text
Configuración
└── Elementos / Minerales
```

Debe permitir:

- Crear elemento.
- Editar elemento.
- Activar/desactivar.
- Definir símbolo.
- Definir unidad de ley/pureza.
- Definir unidad de cotización.
- Definir si usa control de masa.
- Definir clasificación económica.
- Asociar o preparar cotización.
- Crear tabla de pago inicial si aplica.

Cuando se crea un elemento nuevo, debe preguntarse:

```text
¿Desea crear cotización para este elemento?
¿Desea crear tabla de pago?
¿Desea agregarlo a un modelo de valorización?
```

No obligar a configurar todo si no corresponde.

---

# Corrección 4: Tipo de cambio en metales físicos

En `metales.html` o pantalla equivalente mostrar sección:

```text
Tipo de cambio utilizado
Dólar OF:
Dólar COM:
```

Reglas:

- Leer valores desde Configuración Comercial.
- Mostrar claramente el valor aplicado.
- Permitir edición temporal solo si el sistema todavía no tiene roles.
- Guardar copia del tipo de cambio usado en el expediente.
- Bloquear cálculo si el tipo de cambio es 0 o vacío.

---

# Corrección 5: XRF en tiempo real

Cuando el usuario agregue o elimine una lectura XRF:

Actualizar automáticamente:

- lista de lecturas;
- promedio de pureza;
- diferencia máxima;
- estado de verificación;
- totales calculados si ya existen datos suficientes.

El flujo debe ser rápido:

```text
95 + Enter
92 + Enter
94 + Enter
```

El sistema debe mostrar:

```text
Lectura 1: 95%
Lectura 2: 92%
Lectura 3: 94%
Promedio: 93.67%
Diferencia máxima: 3.00%
Estado: CONSISTENTE / REVISAR / SOSPECHOSO
```

---

# Revisión lógica obligatoria

Antes de cerrar este documento, revisar:

- que concentrados siga funcionando;
- que metales físicos siga funcionando;
- que expedientes guarden estados;
- que historial no duplique eventos;
- que configuración comercial siga funcionando;
- que no haya errores en consola.

---

# Entregables

Al finalizar:

1. Indicar archivos modificados.
2. Confirmar que existen botones para cambiar estado.
3. Confirmar que se puede pasar de pendiente a aceptado/rechazado/vencido.
4. Confirmar que existe Configuración de Modelos de Valorización.
5. Confirmar que se pueden crear nuevos elementos/minerales.
6. Confirmar que metales físicos muestra y guarda tipo de cambio usado.
7. Confirmar que XRF se actualiza en tiempo real.
8. Confirmar que no existen errores de consola.
