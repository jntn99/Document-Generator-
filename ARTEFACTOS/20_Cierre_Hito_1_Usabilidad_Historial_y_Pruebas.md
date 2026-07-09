# TIPO DE DOCUMENTO: CONSOLIDACIÓN

# 20_Cierre_Hito_1_Usabilidad_Historial_y_Pruebas.md

## Objetivo

Finalizar el **Hito 1 (Núcleo Comercial)** realizando una revisión completa de usabilidad, estabilidad, historial, flujo de trabajo y experiencia del usuario.

**Este documento NO agrega nuevos módulos.**

Su objetivo es dejar completamente estable el núcleo comercial antes de comenzar el **Hito 2 (Operaciones)**.

---

# Objetivos

- Eliminar comportamientos inconsistentes.
- Mejorar la velocidad de ingreso de datos.
- Reducir clics innecesarios.
- Preparar el sistema para futuros usuarios y roles.
- Confirmar que todo el núcleo comercial funciona correctamente.

---

# 1. Historial

## Problema

Actualmente un mismo expediente puede registrar varias entradas repetidas.

Ejemplo:

- Cotización aceptada.
- Cotización aceptada.
- Cotización aceptada.

Esto genera ruido y dificulta la trazabilidad.

## Implementación requerida

Registrar historial únicamente cuando exista un cambio real.

Eventos válidos:

- Expediente creado.
- Cotización guardada.
- Cotización aceptada.
- Cotización rechazada.
- Cotización vencida.
- Operación abierta.
- Proforma generada.
- Configuración modificada.

No registrar nuevamente una acción si el estado y la información no cambiaron.

---

# 2. Estados

Revisar y unificar los estados de los expedientes.

Estados sugeridos:

- BORRADOR
- COTIZACION_GENERADA
- EN_NEGOCIACION
- COTIZACION_ACEPTADA
- COTIZACION_RECHAZADA
- COTIZACION_VENCIDA
- OPERACION_ABIERTA
- CERRADA

Eliminar estados ambiguos o duplicados.

---

# 3. Historial por usuario

Preparar la arquitectura para el futuro módulo de usuarios.

Agregar al expediente:

```javascript
creadoPor
creadoPorNombre
```

Utilizar temporalmente:

```javascript
usuarioActual.id
usuarioActual.nombre
```

No implementar login todavía.

Objetivo futuro:

- Operador: solo verá sus propios expedientes.
- Administrador: verá todos.

---

# 4. Entrada rápida para análisis XRF

El flujo actual es lento.

Actualmente el operador debe escribir:

Taladro lado A: 95

Esto consume tiempo innecesariamente.

## Nuevo flujo

El operador solo escribe:

95
ENTER
92
ENTER
94
ENTER

Cada ENTER crea automáticamente una nueva lectura:

- Lectura 1
- Lectura 2
- Lectura 3

No pedir nombres como:

- Taladro lado A
- Taladro lado B

El sistema los genera automáticamente.

Debe existir opción para eliminar una lectura.

---

# 5. Atajos de teclado

Agregar soporte para:

- ENTER → agregar nueva lectura.
- TAB → siguiente campo.
- ESC → cancelar edición cuando corresponda.

---

# 6. Formularios

Revisar todos los formularios.

Eliminar:

- campos innecesarios;
- etiquetas repetidas;
- textos redundantes.

Solicitar únicamente la información indispensable.

---

# 7. Validaciones

Revisar todas las validaciones.

Evitar:

- NaN
- undefined
- cálculos silenciosos
- campos obligatorios vacíos

Mostrar mensajes claros.

---

# 8. Rendimiento

Revisar:

- listeners duplicados;
- renderizados repetidos;
- cálculos innecesarios;
- eventos registrados múltiples veces.

---

# 9. Revisión funcional

Verificar completamente:

## Concentrados

- crear;
- calcular;
- guardar;
- imprimir;
- reabrir.

## Metales físicos

- crear;
- agregar ítems;
- registrar análisis XRF;
- calcular;
- imprimir.

## Expedientes

- guardar;
- abrir;
- actualizar.

## Configuración

- cotizaciones;
- tipo de cambio;
- descuentos;
- tablas de pago.

---

# 10. Navegación

Revisar la experiencia completa del usuario.

Verificar:

- siempre exista botón "Volver";
- se pueda regresar al menú principal;
- no existan pantallas bloqueadas;
- nombres consistentes de botones;
- mínima cantidad de clics.

---

# 11. Revisión visual

Verificar:

- alineación;
- tablas;
- botones;
- formato moneda;
- formato fecha;
- espaciado.

---

# 12. Consola

Confirmar:

- sin errores;
- sin warnings importantes.

---

# 13. Preparación para el Hito 2

No implementar todavía:

- Operaciones;
- Inventario;
- Recepción;
- Laboratorio;
- Exportaciones.

Solo confirmar que la arquitectura queda preparada.

---

# Entregables

1. Lista de archivos modificados.
2. Lista de errores corregidos.
3. Lista de optimizaciones realizadas.
4. Confirmación de que el historial ya no duplica registros.
5. Confirmación de que el historial registra únicamente cambios reales.
6. Confirmación de que la entrada rápida XRF funciona mediante ENTER.
7. Confirmación de que el sistema quedó preparado para historial por usuario.
8. Confirmación de que no existen errores de consola.
9. Confirmación de que el Hito 1 queda listo para finalizar.
10. Observaciones técnicas encontradas antes de comenzar el Hito 2.
