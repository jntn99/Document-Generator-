# Implementación del Formulario Dinámico para Concentrados

# Objetivo

Implementar un formulario completamente dinámico para el módulo de concentrados.

El formulario NO debe tener campos escritos manualmente para Pb, Ag, Zn o cualquier otro elemento.

Toda la interfaz deberá generarse automáticamente a partir de la plantilla seleccionada.

Esta será la base para soportar cualquier concentrado futuro sin modificar el HTML.

---

# Contexto del proyecto

Actualmente el proyecto ya cuenta con:

- Menú principal
- Nueva operación
- Selección de categoría
- Selección de plantilla
- Catálogo de elementos
- Catálogo de concentrados
- Catálogo de cooperativas
- Catálogo de conversiones
- Catálogo de cotizaciones
- Motor de cálculo modular
- Validaciones técnicas
- Plantillas con elementos principales y opcionales

La siguiente fase consiste en dejar de depender de formularios estáticos.

---

# Objetivos funcionales

El formulario debe construirse automáticamente utilizando la plantilla seleccionada.

Ejemplo:

Plantilla:
Concentrado de Plomo

Elementos principales:

- Pb
- Ag

El sistema debe generar automáticamente:

- Peso bruto
- Tara
- Humedad
- Ley Pb
- Ley Ag

Sin que exista ningún input fijo en el HTML.

---

# Cambios requeridos

## 1. Crear formulario.js

Crear:

js/Concentrados/formulario.js

Este módulo será el único responsable de construir la interfaz de captura.

No deberá contener cálculos.

Su responsabilidad será únicamente:

- generar controles
- leer datos ingresados
- actualizar liquidacion

---

## 2. Modificar concentrados.html

Eliminar cualquier input fijo de:

- Peso Bruto
- Tara
- Humedad
- Ley Pb
- Ley Ag

Reemplazar por un único contenedor:

```html
<div id="formularioConcentrados"></div>
```

Agregar un botón:

```html
<button id="btnCalcular">
Calcular
</button>
```

No agregar inputs manuales.

---

## 3. Generación automática

formulario.js debe leer:

plantillaActual

y construir:

### Datos físicos

- Peso bruto
- Tara
- Humedad

### Análisis químico

Recorrer:

plantillaActual.elementosPrincipales

y generar automáticamente un input para cada elemento.

Ejemplo:

Ley Pb (%)

Ley Ag (DM)

Si mañana la plantilla cambia a:

Sb
Ag
Au

el formulario debe generarse automáticamente sin modificar código.

---

## 4. Lectura del formulario

Crear una función que lea todos los inputs generados dinámicamente.

Debe actualizar:

liquidacion.pesos

y

liquidacion.analisis

No debe ejecutar cálculos.

---

## 5. Flujo de cálculo

Cuando el usuario presione:

Calcular

el flujo debe ser:

1. Leer formulario
2. Validar datos
3. Calcular pesos
4. Calcular contenido fino
5. Calcular valor bruto
6. Calcular regalías
7. Calcular descuentos
8. Calcular resultado
9. Actualizar pantalla

El formulario no debe contener lógica de cálculo.

---

## 6. Preparar arquitectura para elementos opcionales

No implementar todavía toda la funcionalidad.

Preparar la interfaz para que posteriormente exista:

Botón:

Agregar elemento

Cuando se implemente deberá:

- leer elementosOpcionales de la plantilla
- permitir seleccionar uno
- crear automáticamente un nuevo campo de ley
- agregar el elemento a liquidacion.analisis

No implementar aún.

Solo dejar preparada la arquitectura.

---

## 7. Restricciones

No modificar:

- contenidoFino.js
- valorBruto.js
- pesos.js
- descuentos.js
- regalias.js
- resultado.js

Salvo que sea estrictamente necesario.

No romper el motor de cálculo.

No duplicar lógica entre formulario.js y mostrar.js.

Cada archivo debe mantener una única responsabilidad.

---

## 8. Buenas prácticas

El formulario debe ser completamente independiente del tipo de concentrado.

No debe existir código como:

if (elemento == "PB")

ni

if (plantilla == "PLANTILLA_CONC_PB")

para crear campos.

Toda la información debe provenir de la plantilla y del catálogo de elementos.

---

## Verificaciones esperadas

Después de implementar:

- No deben existir errores en consola.
- El formulario debe generarse automáticamente.
- Debe funcionar con la plantilla actual de plomo.
- Si se cambia la plantilla, el formulario debe adaptarse automáticamente.
- El botón Calcular debe recalcular la liquidación usando los datos ingresados.
- El sistema debe seguir siendo compatible con futuras plantillas.

---

## Entregables

Al finalizar:

1. Indicar qué archivos fueron modificados.
2. Explicar el rol de formulario.js.
3. Explicar cómo se generan los campos dinámicamente.
4. Confirmar que el formulario ya no depende de HTML fijo.
5. Confirmar que el sistema continúa funcionando correctamente.
6. No continuar con la implementación de elementos opcionales hasta presentar el resultado para revisión.
