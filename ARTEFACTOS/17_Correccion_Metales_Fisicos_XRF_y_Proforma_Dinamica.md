# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# 17_Correccion_Metales_Fisicos_XRF_y_Proforma_Dinamica.md

## Objetivo

Corregir el módulo de **Metales Físicos** y preparar una mejora importante para la verificación de metales mediante análisis XRF con taladro.

Actualmente, al seleccionar:

```text
Tipo de material: Metal físico
Modelo de valorización: Oro físico
```

no aparece correctamente la tabla de ítems y el botón **Agregar ítem** no funciona. Esto debe corregirse antes de continuar.

---

# Parte 1: corregir flujo de Metales Físicos

## Problema

Al seleccionar una plantilla/modelo de metal físico, por ejemplo:

```text
Oro físico
```

el sistema no carga correctamente:

- tabla de ítems;
- formulario de metales;
- botón Agregar ítem;
- cálculo por filas.

## Revisión obligatoria

Verificar:

1. Que `nueva-cotizacion.html` o su equivalente redirija correctamente a:

```text
metales.html
```

cuando el tipo de material sea:

```text
METAL_FISICO
```

2. Que `metales.html` cargue todos los scripts necesarios en el orden correcto.

3. Que el contenedor HTML del formulario exista.

Ejemplo:

```html
<div id="formularioMetales"></div>
<div id="tablaMetales"></div>
<button id="btnAgregarItemMetal">Agregar ítem</button>
<button id="btnCalcularMetales">Calcular</button>
```

4. Que `js/Metales/formulario.js` conecte correctamente el botón `btnAgregarItemMetal`.

5. Que al hacer clic en **Agregar ítem** se agregue una nueva fila al arreglo:

```javascript
cotizacionMetales.items
```

6. Que luego se regenere la tabla o formulario.

---

# Parte 2: plantillas base de metales físicos

Verificar que existan y funcionen:

- Oro físico
- Plata física
- Estaño físico

Cada una debe permitir agregar ítems de ese metal, pero también debe quedar preparada para permitir varios metales en una misma cotización si el flujo del sistema lo permite.

---

# Parte 3: análisis XRF con taladro

## Contexto

Para compra de oro, plata u otros metales físicos, Manicone no debe depender únicamente de la pureza declarada por el vendedor.

El procedimiento estándar será:

```text
Análisis XRF con taladro
```

No análisis superficial.

Esto se debe a que algunos lingotes pueden tener una capa externa de mayor pureza que el interior.

---

# Modelo de análisis metalúrgico

Agregar una estructura por ítem de metal físico:

```javascript
analisisMetalurgico: {
  metodoDefault: "XRF_TALADRO",
  lecturas: [],
  promedioPureza: 0,
  diferenciaMaxima: 0,
  estadoVerificacion: "PENDIENTE",
  observaciones: ""
}
```

---

# Lecturas XRF

Cada ítem debe permitir registrar una o varias lecturas.

Ejemplo:

```javascript
{
  punto: "Taladro lado A",
  purezaPorcentaje: 90.2
}
```

```javascript
{
  punto: "Taladro lado B",
  purezaPorcentaje: 74.8
}
```

---

# Cálculos automáticos

El sistema debe calcular:

- promedio de pureza;
- diferencia máxima entre lecturas;
- estado sugerido de verificación.

Ejemplo:

```text
Lectura A: 90.20%
Lectura B: 74.80%
Diferencia: 15.40%
Estado sugerido: SOSPECHOSO
```

---

# Reglas sugeridas de verificación

Usar reglas iniciales configurables:

```text
0% a 3% de diferencia       → CONSISTENTE
3% a 8% de diferencia       → REVISAR
Mayor a 8% de diferencia    → SOSPECHOSO
```

El sistema puede sugerir refundición, pero no debe bloquear automáticamente por ahora.

---

# Estados de verificación

Usar:

```javascript
PENDIENTE
CONSISTENTE
REVISAR
SOSPECHOSO
REQUIERE_REFUNDICION
APROBADO
RECHAZADO
```

---

# Refundición

Preparar la estructura para registrar si se realizó refundición.

No implementar todo el flujo todavía.

Campos sugeridos:

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

---

# Parte 4: responsable desde login futuro

Actualmente puede haber campos manuales para responsable.

Preparar el sistema para que, en el futuro, el responsable se registre automáticamente desde el usuario logueado.

Por ahora usar un placeholder:

```javascript
const usuarioActual = {
  id: "USR_TEMP",
  nombre: "Usuario temporal",
  rol: "OPERADOR"
};
```

Cuando se registre una acción, usar:

```javascript
usuarioActual.id
usuarioActual.nombre
```

No pedir manualmente al operador que escriba su propio nombre si no es necesario.

---

# Parte 5: datos opcionales en proforma

## Problema

No siempre se tienen todos los datos del vendedor/proveedor:

- documento de identidad;
- número de credencial;
- procedencia;
- observaciones;
- cooperativa emisora;
- contacto.

Cuando se genere la proforma, no deben aparecer campos vacíos.

## Regla

En la proforma imprimible:

```text
Si un campo no tiene valor, no se muestra.
```

Ejemplo:

Si no hay número de credencial, no mostrar:

```text
Número de credencial:
```

vacío.

Solo mostrar datos realmente capturados.

---

# Parte 6: compatibilidad

No romper:

- concentrados;
- configuración comercial;
- cotizaciones;
- expedientes;
- proforma de concentrados;
- motor de valorización existente.

---

# Verificaciones obligatorias

## Caso 1: Oro físico

1. Crear nueva cotización.
2. Seleccionar:
   - Tipo de material: Metal físico
   - Modelo de valorización: Oro físico
3. Abrir pantalla de metales.
4. Confirmar que aparece tabla/formulario.
5. Hacer clic en Agregar ítem.
6. Confirmar que se agrega una fila.
7. Ingresar peso, pureza, presentación y cotización.
8. Calcular.

## Caso 2: botón Agregar ítem

Debe funcionar sin errores de consola.

## Caso 3: datos opcionales

Si un dato de proveedor está vacío, no debe aparecer en la proforma imprimible.

## Caso 4: XRF

Registrar dos lecturas:

```text
90.2
74.8
```

El sistema debe calcular diferencia y marcar el estado como sospechoso o revisar según regla.

---

# Entregables

Al finalizar:

1. Indicar archivos modificados.
2. Confirmar que `metales.html` carga correctamente.
3. Confirmar que el botón Agregar ítem funciona.
4. Confirmar que Oro, Plata y Estaño físico funcionan.
5. Confirmar que se preparó análisis XRF con taladro.
6. Confirmar que los datos opcionales no aparecen vacíos en la proforma.
7. Confirmar que el responsable queda preparado para tomar datos desde login futuro.
8. Confirmar que no existen errores en consola.
