# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# Implementación de Tablas de Pago Configurables, Regalías en Porcentaje y Ocultamiento de Reglas Internas

## Objetivo

Corregir y profesionalizar el motor de cálculo comercial para que:

1. El sistema aplique correctamente el **porcentaje de pago** antes de calcular regalías y resultado final.
2. Las **alícuotas de regalías** se configuren en porcentaje visible para el administrador, por ejemplo `3` o `3.6`, pero internamente se conviertan a decimal.
3. Las **tablas de pago** sean editables desde Configuración.
4. El operador que genera la cotización no vea porcentajes de pago, descuentos internos ni reglas comerciales sensibles.
5. El sistema permita crear tablas de pago por elemento con rangos de ley de 5% en 5%, pero también permita alternativas más simples para no cargar demasiados datos manualmente.

---

## Contexto

Actualmente el sistema calcula:

```text
Valor bruto → Regalías → Descuentos → Líquido pagable
```

Pero falta una etapa importante usada en la política comercial de la empresa:

```text
Valor bruto → Porcentaje de pago → Valor pagable → Regalías → Descuentos → Líquido pagable
```

Además, se detectó que las regalías se están calculando incorrectamente porque el sistema puede estar interpretando `3` como `300%` en lugar de `3%`.

---

## Problemas actuales

### 1. Regalías multiplicadas incorrectamente

Si el administrador configura:

```text
3
```

El sistema debe interpretarlo como:

```text
3%
```

Internamente debe convertirse a:

```javascript
3 / 100 = 0.03
```

Lo mismo para:

```text
3.6
```

Debe convertirse a:

```javascript
3.6 / 100 = 0.036
```

---

### 2. Falta porcentaje de pago

El sistema actualmente calcula regalías directamente sobre valor bruto.

Debe aplicar primero una política de pago.

Ejemplo:

```text
Valor bruto Pb: Bs 193.143,02
Porcentaje de pago aplicado: 95%
Valor pagable Pb: Bs 183.485,87
Regalía Pb: valor pagable × 3%
```

---

### 3. El operador no debe ver reglas internas

El operador no debe ver:

- porcentaje de pago aplicado;
- tabla de pago usada;
- descuentos internos;
- reglas comerciales;
- márgenes.

El administrador sí puede verlos en modo administrativo.

---

## Arquitectura requerida

Crear o mejorar el módulo:

```text
Configuración
└── Tablas de Pago
```

Debe permitir administrar reglas de pago por elemento.

---

## Tipos de tabla de pago

Implementar dos modos.

### Modo 1: Pago fijo

El administrador puede definir un porcentaje fijo para un elemento.

Ejemplo:

```text
Elemento: Pb
Modo: Pago fijo
Porcentaje de pago: 90%
```

Esto evita llenar rangos cuando no hace falta.

---

### Modo 2: Pago por rango de ley

El administrador puede definir rangos de ley.

Ejemplo para elementos con ley en porcentaje:

```text
Elemento: Pb

Rango de ley       % Pago
0 - 5              50
5 - 10             55
10 - 15            60
15 - 20            65
20 - 25            70
25 - 30            75
30 - 35            80
35 - 40            82
40 - 45            84
45 - 50            86
50 - 55            88
55 - 60            90
60 - 65            92
65 - 70            94
70 - 75            95
75 - 80            96
80 - 85            97
85 - 90            98
90 - 95            99
95 - 100           100
```

Los rangos sugeridos deben generarse automáticamente de 5% en 5%.

El administrador solo ajusta los porcentajes de pago.

---

## Generador automático de rangos

Agregar una herramienta en configuración para generar automáticamente rangos.

Parámetros:

```text
Inicio: 0
Fin: 100
Paso: 5
```

Debe crear automáticamente:

```text
0-5
5-10
10-15
...
95-100
```

---

## Clonar tabla de pago

Para evitar cargar todo manualmente, permitir crear una tabla copiando otra existente.

Ejemplo:

```text
Crear tabla para Ta copiando tabla de Sb
```

Después el administrador puede editar solo los valores que cambian.

---

## Plantillas de tabla de pago

Preparar plantillas base.

Ejemplos:

```text
Metal base %
Metal precioso
Mineral crítico
Sin pago automático
```

Cuando se cree un nuevo elemento, el administrador podrá elegir:

```text
¿Usar plantilla de tabla de pago?
```

Opciones:

- Metal base %
- Metal precioso
- Copiar desde otro elemento
- Crear desde cero
- Pago fijo

---

## Nueva estructura sugerida

Crear o adaptar un catálogo:

```text
catalogos/tablasPago.js
```

Estructura sugerida:

```javascript
const tablasPago = {
  PB: {
    modo: "RANGO_LEY",
    unidadLey: "%",
    rangos: [
      { desde: 0, hasta: 5, porcentajePago: 50 },
      { desde: 5, hasta: 10, porcentajePago: 55 },
      { desde: 10, hasta: 15, porcentajePago: 60 }
    ],
    activo: true
  },

  AG: {
    modo: "FIJO",
    unidadLey: "DM",
    porcentajePago: 90,
    activo: true
  }
};
```

---

## Función requerida

Crear una función:

```javascript
obtenerPorcentajePago(elementoId, ley)
```

Debe:

1. Buscar la tabla de pago del elemento.
2. Revisar si el modo es `FIJO` o `RANGO_LEY`.
3. Si es `FIJO`, devolver el porcentaje configurado.
4. Si es `RANGO_LEY`, buscar el rango donde cae la ley.
5. Devolver el porcentaje en formato decimal para cálculo.

Ejemplo:

```javascript
95 -> 0.95
90 -> 0.90
```

---

## Cálculo esperado

Modificar el flujo de cálculo para incluir:

```text
Valor bruto
↓
Porcentaje de pago
↓
Valor pagable
↓
Regalías
↓
Descuentos
↓
Resultado final
```

Por elemento:

```javascript
valorPagable = valorBruto * porcentajePagoDecimal
```

Luego:

```javascript
regalia = valorPagable * alicuotaDecimal
```

---

## Pantalla de resultados

### Vista operador

Debe mostrar solo:

- valor final a pagar;
- datos del material;
- peso;
- análisis;
- resultado final.

No mostrar:

- porcentaje de pago;
- valor pagable interno;
- descuentos internos;
- tabla usada.

### Vista administrador

Puede mostrar el desglose completo:

- valor bruto;
- porcentaje de pago;
- valor pagable;
- regalías;
- descuentos;
- líquido pagable.

Si todavía no existe sistema de roles, dejar preparado con una variable temporal.

Ejemplo:

```javascript
const usuarioActual = {
  rol: "ADMIN"
};
```

o

```javascript
const mostrarDetalleInterno = true;
```

---

## Regalías

En Configuración, el administrador escribe:

```text
Pb: 3
Ag: 3.6
```

El sistema debe convertir internamente:

```javascript
3 / 100
3.6 / 100
```

Nunca debe multiplicar por `3` directamente.

---

## Validaciones

Agregar validaciones:

1. No permitir porcentaje de pago menor a 0.
2. No permitir porcentaje de pago mayor a 100.
3. No permitir alícuota de regalía menor a 0.
4. No permitir alícuota de regalía mayor a 100.
5. Si no existe tabla de pago para un elemento pagable, mostrar error claro.
6. Si el porcentaje de pago es 0, mostrar advertencia clara.

---

## Compatibilidad

No romper:

- formulario dinámico;
- expedientes;
- cotizaciones;
- elementos opcionales;
- configuración comercial existente;
- tipo de cambio.

---

## Archivos probables a revisar

- `catalogos/tablasPago.js`
- `js/Concentrados/valorBruto.js`
- `js/Concentrados/regalias.js`
- `js/Concentrados/resultado.js`
- `js/Concentrados/mostrar.js`
- `js/Concentrados/validaciones.js`
- archivos de Configuración Comercial

---

## Verificaciones esperadas

### Caso 1: regalía correcta

Valor base:

```text
Bs 193.143,02
Alícuota: 3
```

Debe calcular:

```text
Bs 5.794,29
```

No:

```text
Bs 579.429,06
```

### Caso 2: porcentaje de pago

Valor bruto:

```text
Bs 100.000
Porcentaje de pago: 90
```

Debe calcular:

```text
Valor pagable: Bs 90.000
```

### Caso 3: operador

El operador no debe ver:

```text
Porcentaje de pago: 90%
```

ni:

```text
Tabla de pago aplicada
```

### Caso 4: administrador

El administrador sí puede ver el desglose completo.

---

## Entregables

Al finalizar:

1. Indicar archivos modificados.
2. Confirmar que las alícuotas se ingresan como porcentaje visible.
3. Confirmar que internamente se convierten a decimal.
4. Confirmar que se agregó el porcentaje de pago antes de regalías.
5. Confirmar que existen tablas de pago editables.
6. Confirmar que existen rangos de 5% en 5%.
7. Confirmar que se puede usar pago fijo.
8. Confirmar que se pueden clonar tablas.
9. Confirmar que el operador no ve reglas internas.
10. Confirmar que el cálculo ya no genera líquido pagable negativo por error de regalías.
