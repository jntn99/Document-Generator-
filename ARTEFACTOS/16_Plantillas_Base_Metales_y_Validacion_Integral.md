# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 16_Plantillas_Base_Metales_y_Validacion_Integral.md

## Objetivo

Completar el módulo de Metales Físicos para que quede listo para utilizarse en operaciones reales, incorporando plantillas base, datos del proveedor, trazabilidad y una validación integral del flujo.

---

# 1. Crear plantillas base

Crear tres modelos iniciales:

- Oro Físico
- Plata Física
- Estaño Físico

Estas plantillas serán el punto de partida para futuras plantillas configurables.

Cada plantilla debe cargar automáticamente:

- Tipo de material: Metal físico
- Presentaciones permitidas
- Unidad de peso
- Unidad de pureza
- Unidad de cotización

No duplicar lógica; reutilizar el Motor de Metales.

---

# 2. Datos del proveedor

Agregar una sección "Proveedor" con los siguientes campos:

- Cooperativa / Empresa
- Nombre del vendedor
- Documento de identidad (opcional)
- Número de credencial de la cooperativa
- Cooperativa emisora de la credencial (si aplica)
- Origen del material
- Observaciones

Preparar autocompletado para cooperativas existentes.

Todos estos datos deben guardarse en el Expediente Comercial.

---

# 3. Tipo de operación

Agregar un selector:

- Cotización preliminar
- Compra directa
- Liquidación final

Guardar el valor en el expediente para futuras consultas.

---

# 4. Terminología

En el módulo de metales utilizar siempre:

"Pureza (%)"

No utilizar "Ley (%)" en la interfaz de metales.

Las fórmulas permanecen iguales.

---

# 5. Trazabilidad por ítem

Cada fila debe poder registrar opcionalmente:

- Código interno de lote
- Observaciones

Preparar la estructura para futuras referencias a inventario.

---

# 6. Credencial del cooperativista

No implementar carga de archivos todavía.

Registrar solamente:

- Número de credencial
- Cooperativa emisora

Preparar la estructura para permitir adjuntar una imagen o PDF en una versión futura.

---

# 7. Validación integral

Revisar el módulo completo de Metales Físicos.

Verificar:

- Flujo desde Nueva Cotización.
- Creación del expediente.
- Recepción de datos del proveedor.
- Agregado y eliminación de ítems.
- Lectura de cotizaciones.
- Tipo de cambio.
- Cálculos.
- Totales.
- Guardado.
- Reapertura del expediente.
- Persistencia en localStorage.
- Compatibilidad con el resto del ERP.

Corregir cualquier error detectado.

---

# 8. Optimización

Eliminar:

- Código duplicado.
- Variables sin uso.
- Funciones repetidas.

Reutilizar servicios comunes cuando sea posible.

No romper el módulo de concentrados.

---

# 9. Validaciones

Verificar que:

- Todos los campos obligatorios estén validados.
- No existan errores en consola.
- No existan valores NaN o undefined.
- El cálculo no continúe si faltan datos críticos.
- Las cotizaciones y el tipo de cambio se lean correctamente.

---

# 10. Entregables

Al finalizar:

1. Listar archivos creados y modificados.
2. Confirmar que funcionan las plantillas:
   - Oro Físico
   - Plata Física
   - Estaño Físico
3. Confirmar que los datos del proveedor se guardan en el expediente.
4. Confirmar que el tipo de operación queda registrado.
5. Confirmar que "Pureza" reemplaza a "Ley" únicamente en metales.
6. Confirmar que el flujo completo funciona sin errores.
7. Enumerar mejoras de arquitectura detectadas durante la revisión que convenga implementar en fases futuras, sin aplicarlas todavía.
