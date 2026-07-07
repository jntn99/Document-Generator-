# Instrucciones para implementar elementos principales y elementos opcionales

## Contexto

Actualmente el sistema utiliza plantillas de liquidación para definir los elementos que forman parte de una operación.

Hoy una plantilla tiene una estructura similar a:

```javascript
elementos: ["PB", "AG"]
```

Esto es insuficiente para representar la realidad de una operación minera.

En un concentrado de plomo normalmente existirán Pb y Ag, pero dependiendo del lote, productor o resultado del laboratorio también pueden aparecer Zn, Cu, Sb, Au u otros elementos.

El objetivo es modificar la arquitectura para soportar estos escenarios sin tener que modificar el código cada vez que aparezca un nuevo elemento.

---

# Objetivo

Modificar el sistema para que cada plantilla tenga:

- elementosPrincipales
- elementosOpcionales

Los elementos principales siempre aparecerán automáticamente en la operación.

Los elementos opcionales podrán ser agregados por el operador durante la captura de datos.

---

# Alcance

Este cambio debe afectar únicamente la arquitectura de las plantillas y del formulario.

No debe romper el motor de cálculos existente.

No debe modificar todavía la lógica de cálculo.

No debe modificar el módulo de metales físicos.

No debe modificar el resto de los catálogos.

---

# Cambios requeridos

## 1. Modificar plantillasLiquidacion.js

Reemplazar la propiedad:

```javascript
elementos
```

por dos nuevas propiedades:

```javascript
elementosPrincipales

elementosOpcionales
```

Ejemplo:

```javascript
{
    id: "PLANTILLA_CONC_PB",

    nombre: "Concentrado de Plomo",

    tipoOperacion: "CONCENTRADO_MINERAL",

    concentradoId: "CONC_PB",

    elementosPrincipales: [
        "PB",
        "AG"
    ],

    elementosOpcionales: [
        "ZN",
        "CU",
        "AU",
        "SB"
    ],

    usaPesos: true,
    usaHumedad: true,
    usaTara: true,
    usaMerma: false,
    usaRegalias: true,
    usaDescuentos: true,

    activo: true
}
```

---

## 2. Modificar datos.js

Actualmente el análisis se genera utilizando:

```javascript
plantillaActual.elementos
```

Debe modificarse para utilizar:

```javascript
plantillaActual.elementosPrincipales
```

Los elementos principales deben cargarse automáticamente cuando se crea una nueva operación.

Los elementos opcionales NO deben agregarse automáticamente.

---

## 3. Revisar elementos.js

Verificar que todos los elementos opcionales utilizados por las plantillas existan dentro del catálogo.

Si alguno no existe, crearlo.

Ejemplo:

- Zn
- Cu
- Sb
- Sn
- Bi
- As
- etc.

Cada elemento debe mantener la arquitectura ya utilizada por el proyecto:

- unidadLey
- unidadContenido
- unidadCotizacion
- tipoCalculoContenido
- tipoCalculoValor

---

## 4. Crear soporte para elementos opcionales

Todavía no se debe modificar el motor de cálculo.

Únicamente preparar la estructura para que una operación pueda recibir elementos adicionales.

La estructura esperada es:

```javascript
analisis = [

{
    elementoId:"PB",
    ley:70
},

{
    elementoId:"AG",
    ley:7
}

]
```

Posteriormente deberán poder agregarse nuevos objetos al arreglo.

Ejemplo:

```javascript
{
    elementoId:"ZN",
    ley:1.8
}
```

sin modificar ninguna otra parte del sistema.

---

## 5. Formulario dinámico

No construir todavía el formulario completo.

Únicamente preparar la arquitectura para que posteriormente sea posible generar automáticamente los campos de captura utilizando:

```javascript
plantillaActual.elementosPrincipales
```

En el futuro el formulario deberá generarse automáticamente.

Ejemplo:

```
Peso Bruto

Tara

Humedad

Ley Pb

Ley Ag
```

Si el usuario agrega Zinc:

```
Ley Zinc
```

deberá aparecer automáticamente.

---

## 6. Agregar botón "Agregar elemento"

Preparar la estructura para incorporar un botón:

```
Agregar elemento
```

Todavía no es necesario implementar toda su funcionalidad.

Solo dejar preparada la arquitectura para que posteriormente:

- lea los elementosOpcionales de la plantilla
- permita seleccionar uno
- agregue un nuevo objeto al arreglo analisis

---

# Restricciones

No modificar:

- reglasCalculo.js
- valorBruto.js
- contenidoFino.js
- pesos.js
- resultado.js

a menos que sea estrictamente necesario.

La prioridad es mantener el sistema funcionando exactamente igual que ahora.

---

# Verificaciones esperadas

Al finalizar:

- El proyecto debe seguir ejecutándose sin errores.
- La plantilla de plomo debe seguir mostrando Pb y Ag automáticamente.
- Los elementos opcionales deben quedar definidos pero aún no mostrarse automáticamente.
- No deben existir errores de consola.
- No deben romperse las liquidaciones existentes.

---

# Entregables

Al finalizar los cambios:

1. Explicar qué archivos fueron modificados.
2. Explicar por qué se modificó cada uno.
3. Explicar cómo quedó la nueva arquitectura.
4. Confirmar que el sistema sigue funcionando igual que antes.
5. No continuar con nuevos cambios sin presentar primero un resumen del resultado.