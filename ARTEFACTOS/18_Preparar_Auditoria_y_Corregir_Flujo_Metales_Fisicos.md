# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 18_Preparar_Auditoria_y_Corregir_Flujo_Metales_Fisicos.md

## Objetivo

Realizar dos mejoras importantes:

1. Preparar estructuras básicas para auditoría, trazabilidad y futuro sistema de usuarios/roles, sin implementar login todavía.
2. Corregir el flujo de cotización de metales físicos para que sea coherente con el proceso real de compra.

---

## Parte 1: Auditoría básica futura

Agregar campos base a expedientes, cotizaciones y documentos relevantes:

```javascript
auditoria: {
  creadoPor: "USR_TEMP",
  creadoPorNombre: "Usuario temporal",
  creadoEl: "",
  actualizadoPor: null,
  actualizadoPorNombre: null,
  actualizadoEl: null,
  version: 1,
  estadoRegistro: "BORRADOR"
}
```

Crear o reutilizar un placeholder:

```javascript
const usuarioActual = {
  id: "USR_TEMP",
  nombre: "Usuario temporal",
  rol: "OPERADOR"
};
```

No implementar login ni permisos reales todavía.

---

## Parte 2: Corregir metales físicos

### Problemas actuales

- El sistema pide código de lote manual.
- Permite poner pureza antes de registrar lecturas XRF.
- El encabezado muestra por defecto Cooperativa Minera Asientos.
- Los datos del proveedor están duplicados o son incongruentes.
- Falta opción clara para imprimir/generar proforma.

---

## Corrección 1: Código de lote

El usuario no debe escribir manualmente el código de lote durante cotización.

Usar códigos temporales automáticos por ítem:

```text
ITEM-001
ITEM-002
ITEM-003
```

El código real de lote se generará en el módulo de inventario, no en la cotización.

---

## Corrección 2: Pureza desde XRF

La pureza no debe escribirse manualmente como primer paso.

Flujo correcto:

```text
Seleccionar metal
↓
Seleccionar presentación
↓
Ingresar peso
↓
Registrar lecturas XRF con taladro
↓
Sistema calcula pureza promedio
↓
Sistema calcula diferencia máxima
↓
Sistema sugiere estado de verificación
↓
Sistema calcula la cotización
```

---

## Lecturas XRF

Cada ítem debe permitir varias lecturas:

```javascript
lecturasXRF: [
  { punto: "Taladro lado A", purezaPorcentaje: 90.2 },
  { punto: "Taladro lado B", purezaPorcentaje: 74.8 }
]
```

Calcular:

- pureza promedio;
- diferencia máxima;
- estado sugerido.

Reglas sugeridas:

```text
0% a 3% diferencia       → CONSISTENTE
3% a 8% diferencia       → REVISAR
Mayor a 8% diferencia    → SOSPECHOSO
```

---

## Estados de verificación

```javascript
PENDIENTE
CONSISTENTE
REVISAR
SOSPECHOSO
REQUIERE_REFUNDICION
APROBADO
RECHAZADO
```

No bloquear automáticamente por ahora.

---

## Refundición

Preparar estructura futura:

```javascript
refundicion: {
  requerida: false,
  realizada: false,
  motivo: "",
  fecha: "",
  responsableId: null,
  observaciones: ""
}
```

No implementar flujo completo todavía.

---

## Corrección 3: Proveedor

No mostrar proveedor fijo por defecto.

Si no hay proveedor:

```text
Proveedor no definido
```

o no mostrarlo en proforma imprimible.

Datos del proveedor en una sola sección:

- Cooperativa / Empresa / Persona
- Nombre del vendedor
- Documento de identidad
- Número de credencial de cooperativa
- Cooperativa emisora de la credencial
- Procedencia / origen del material
- Observaciones

Guardar todo en el expediente.

---

## Corrección 4: Campos opcionales en proforma

En la proforma imprimible:

```text
Si un campo está vacío, no se muestra.
```

No mostrar etiquetas vacías.

---

## Parte 3: Proforma imprimible de metales físicos

Agregar opción:

```text
Generar proforma
Imprimir proforma
Vista imprimible
```

Debe mostrar:

- empresa;
- código de cotización;
- fecha;
- proveedor solo si existe;
- credencial solo si existe;
- tipo de operación;
- metal;
- presentación;
- peso;
- lecturas XRF o resumen de pureza;
- pureza promedio;
- cotización;
- tipo de cambio;
- total por ítem;
- total general;
- observaciones;
- firmas.

No debe mostrar:

- historial interno;
- estado interno;
- botones;
- auditoría;
- recomendaciones internas como SOSPECHOSO;
- márgenes internos.

---

## Validaciones

Antes de calcular:

1. Debe existir al menos un ítem.
2. Cada ítem debe tener metal.
3. Cada ítem debe tener presentación.
4. Cada ítem debe tener peso mayor a 0.
5. Cada ítem debe tener al menos una lectura XRF.
6. Pureza promedio entre 0 y 100.
7. Cotización existente.
8. Tipo de cambio mayor a 0.

---

## Compatibilidad

No romper:

- concentrados;
- cotizaciones de concentrados;
- configuración comercial;
- expedientes;
- historial;
- servicio de cotizaciones.

---

## Verificaciones

### Caso 1

Crear cotización de Oro físico, agregar ítem, registrar lecturas XRF, calcular e imprimir proforma.

### Caso 2

Lecturas 90.20 y 74.80 deben generar diferencia alta y estado sugerido SOSPECHOSO o REVISAR.

### Caso 3

Si proveedor está vacío, la proforma no debe mostrar campos vacíos.

### Caso 4

El botón Agregar ítem debe funcionar sin errores de consola.

---

## Entregables

1. Archivos modificados.
2. Auditoría básica agregada.
3. Placeholder usuarioActual creado.
4. Código de lote ya no obligatorio en cotización.
5. Pureza calculada desde XRF.
6. Proveedor no fijo.
7. Proforma sin campos vacíos.
8. Opción de imprimir/generar proforma.
9. Sin errores de consola.
