# Instrucciones para implementar validación técnica de leyes porcentuales

## Contexto

El sistema **Manicone Document Generator** está evolucionando hacia un motor configurable para proformas mineras.

Actualmente se trabaja con concentrados minerales donde cada operación puede contener distintos elementos químicos, por ejemplo:

- Pb
- Ag
- Zn
- Cu
- Sb
- Au
- Ta

Un concentrado puede tener elementos principales y elementos opcionales. Sin embargo, no todos los elementos usan la misma unidad de ley.

Ejemplos:

- Pb: %
- Zn: %
- Cu: %
- Sb: %
- Ag: DM
- Au: g/TM
- Ta: ppm o %

Por eso, **no es correcto sumar todas las leyes y exigir que no pasen de 100%**.

La plata en DM, el oro en g/TM o elementos en ppm no deben entrar en la validación porcentual de masa.

---

## Objetivo

Implementar una validación técnica para evitar que la suma de las leyes porcentuales supere límites razonables.

La validación debe:

1. Sumar únicamente los elementos que representen porcentaje de masa.
2. Ignorar elementos con unidades como DM, g/TM, ppm u otras unidades no porcentuales.
3. Permitir una tolerancia pequeña por redondeos de laboratorio.
4. Generar advertencias o errores según el caso.
5. No romper el motor de cálculo existente.

---

## Regla técnica

La validación debe funcionar así:

```text
Elementos con control de masa:
Pb = 60%
Zn = 20%
Cu = 5%
Sb = 3%

Suma porcentual = 88%
Resultado = OK
```

Pero:

```text
Ag = 7 DM
Au = 3 g/TM
Ta = 250 ppm
```

no deben entrar en esa suma.

---

## Tolerancia propuesta

Usar tres niveles:

```text
0% a 100%        → OK
100% a 100.5%    → ADVERTENCIA
Mayor a 100.5%   → ERROR
```

La tolerancia de 0.5% permite pequeñas diferencias por redondeo, digitación o resultados de laboratorio.

---

## Cambio requerido en elementos.js

Agregar a cada elemento una propiedad nueva:

```javascript
controlMasa: true
```

o

```javascript
controlMasa: false
```

Ejemplo para plomo:

```javascript
{
  id: "PB",
  nombre: "Plomo",
  simbolo: "Pb",
  unidadLey: "%",
  unidadContenido: "kg",
  unidadCotizacion: "L.F.",
  tipoCalculoContenido: "PORCENTAJE",
  tipoCalculoValor: "KG_A_LIBRAS",
  clasificacionEconomica: "PAGABLE",
  controlMasa: true
}
```

Ejemplo para plata:

```javascript
{
  id: "AG",
  nombre: "Plata",
  simbolo: "Ag",
  unidadLey: "DM",
  unidadContenido: "gr",
  unidadCotizacion: "O.T.",
  tipoCalculoContenido: "DECIMARCO",
  tipoCalculoValor: "GRAMOS_A_ONZAS",
  clasificacionEconomica: "PAGABLE",
  controlMasa: false
}
```

Ejemplo para oro:

```javascript
{
  id: "AU",
  nombre: "Oro",
  simbolo: "Au",
  unidadLey: "g/TM",
  unidadContenido: "gr",
  unidadCotizacion: "O.T.",
  tipoCalculoContenido: "GRAMOS_POR_TONELADA",
  tipoCalculoValor: "GRAMOS_A_ONZAS",
  clasificacionEconomica: "PAGABLE",
  controlMasa: false
}
```

---

## Criterio importante

La validación debe usar preferentemente:

```javascript
elemento.controlMasa === true
```

y no solamente:

```javascript
elemento.unidadLey === "%"
```

Motivo:

Puede haber casos especiales en los que un elemento tenga unidad porcentual pero se quiera tratar de forma diferente según contrato, comprador o tipo de análisis.

---

## Crear archivo nuevo

Crear este archivo:

```text
js/Concentrados/validaciones.js
```

---

## Función requerida

Implementar una función llamada:

```javascript
validarSumaPorcentual()
```

Debe devolver un objeto con esta estructura:

```javascript
{
  estado: "OK" | "ADVERTENCIA" | "ERROR",
  sumaPorcentual: number,
  mensajes: []
}
```

Ejemplo de implementación esperada:

```javascript
function validarSumaPorcentual() {
  let sumaPorcentual = 0;
  const elementosIncluidos = [];

  liquidacion.analisis.forEach(item => {
    const elemento = buscarElemento(item.elementoId);

    if (!elemento) {
      return;
    }

    if (elemento.controlMasa === true) {
      const ley = Number(item.ley) || 0;
      sumaPorcentual += ley;

      elementosIncluidos.push({
        elementoId: elemento.id,
        simbolo: elemento.simbolo,
        ley: ley
      });
    }
  });

  const resultado = {
    estado: "OK",
    sumaPorcentual: sumaPorcentual,
    elementosIncluidos: elementosIncluidos,
    mensajes: []
  };

  if (sumaPorcentual > 100.5) {
    resultado.estado = "ERROR";
    resultado.mensajes.push(
      "La suma de leyes porcentuales supera el límite permitido. Suma actual: " +
      sumaPorcentual.toFixed(2) +
      "%."
    );
    return resultado;
  }

  if (sumaPorcentual > 100) {
    resultado.estado = "ADVERTENCIA";
    resultado.mensajes.push(
      "La suma de leyes porcentuales supera levemente el 100%. Revisar redondeos o análisis de laboratorio. Suma actual: " +
      sumaPorcentual.toFixed(2) +
      "%."
    );
    return resultado;
  }

  resultado.mensajes.push(
    "Suma porcentual válida: " + sumaPorcentual.toFixed(2) + "%."
  );

  return resultado;
}
```

---

## Función general de validación

Crear también:

```javascript
function validarLiquidacion()
```

Debe validar:

1. Peso bruto mayor a 0.
2. Tara no negativa.
3. Tara menor al peso bruto.
4. Humedad entre 0% y 100%.
5. Suma porcentual usando `validarSumaPorcentual()`.

Estructura esperada:

```javascript
function validarLiquidacion() {
  const errores = [];
  const advertencias = [];

  if (liquidacion.pesos.pesoBrutoKg <= 0) {
    errores.push("El peso bruto debe ser mayor a 0.");
  }

  if (liquidacion.pesos.taraKg < 0) {
    errores.push("La tara no puede ser negativa.");
  }

  if (liquidacion.pesos.taraKg >= liquidacion.pesos.pesoBrutoKg) {
    errores.push("La tara no puede ser igual o mayor al peso bruto.");
  }

  if (
    liquidacion.pesos.humedadPorcentaje < 0 ||
    liquidacion.pesos.humedadPorcentaje > 1
  ) {
    errores.push("La humedad debe estar entre 0% y 100%.");
  }

  const validacionPorcentual = validarSumaPorcentual();

  if (validacionPorcentual.estado === "ERROR") {
    errores.push(...validacionPorcentual.mensajes);
  }

  if (validacionPorcentual.estado === "ADVERTENCIA") {
    advertencias.push(...validacionPorcentual.mensajes);
  }

  return {
    valido: errores.length === 0,
    errores: errores,
    advertencias: advertencias,
    sumaPorcentual: validacionPorcentual.sumaPorcentual
  };
}
```

---

## Integración en concentrados.html

Cargar el nuevo archivo antes de `concentrados.js`:

```html
<script src="js/Concentrados/validaciones.js"></script>
<script src="js/Concentrados/concentrados.js"></script>
```

Debe ir después de los archivos de cálculo y antes del archivo principal que ejecuta todo.

---

## Integración en concentrados.js

Antes de ejecutar los cálculos principales, llamar a:

```javascript
const validacion = validarLiquidacion();

if (!validacion.valido) {
  alert(validacion.errores.join("\n"));
  throw new Error("Liquidación inválida.");
}

if (validacion.advertencias.length > 0) {
  console.warn("Advertencias de validación:", validacion.advertencias);
}
```

Luego continuar con:

```javascript
calcularPesos();
calcularContenidoFino();
calcularValorBruto();
calcularRegalias();
calcularDescuentos();
calcularResultado();
```

---

## Restricciones

No modificar la lógica de cálculo salvo que sea estrictamente necesario.

No cambiar las fórmulas de:

- contenidoFino.js
- valorBruto.js
- regalias.js
- descuentos.js
- resultado.js

El objetivo de este cambio es únicamente validar datos antes de calcular.

---

## Verificaciones esperadas

### Caso 1: válido

```text
Pb = 70%
Zn = 20%
Cu = 5%
Ag = 7 DM
```

Resultado esperado:

```text
OK
Suma porcentual = 95%
```

### Caso 2: advertencia

```text
Pb = 80%
Zn = 20.2%
Ag = 7 DM
```

Resultado esperado:

```text
ADVERTENCIA
Suma porcentual = 100.2%
```

### Caso 3: error

```text
Pb = 80%
Zn = 25%
Ag = 7 DM
```

Resultado esperado:

```text
ERROR
Suma porcentual = 105%
```

### Caso 4: plata no entra en la suma

```text
Pb = 70%
Ag = 999 DM
```

Resultado esperado:

```text
OK
Suma porcentual = 70%
```

---

## Entregables

Al terminar:

1. Indicar qué archivos fueron modificados.
2. Confirmar que `controlMasa` fue agregado a los elementos correspondientes.
3. Confirmar que `validaciones.js` fue creado.
4. Confirmar que `concentrados.html` carga `validaciones.js`.
5. Confirmar que `concentrados.js` valida antes de calcular.
6. Confirmar que el sistema sigue funcionando sin errores de consola.
