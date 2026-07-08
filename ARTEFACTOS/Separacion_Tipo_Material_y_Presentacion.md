# Separación entre Tipo de Material y Presentación Física

## Objetivo

Modificar la arquitectura del sistema para separar claramente el concepto de **Tipo de Material** del concepto de **Presentación Física**.

Esta separación permitirá que el sistema represente correctamente la realidad del comercio de minerales y metales físicos, evitando mezclar conceptos y facilitando la incorporación de nuevos materiales en el futuro.

---

# Contexto

Actualmente el sistema utiliza plantillas para realizar cotizaciones.

Sin embargo, una misma lógica de cálculo puede aplicarse a distintas presentaciones físicas.

Ejemplo:

Plomo (Pb-Ag)

Puede comprarse como:

- Mineral en bruto
- Concentrado
- Material seleccionado
- Granza
- Relave

Todos utilizan prácticamente la misma lógica de cálculo.

Del mismo modo, un metal físico puede presentarse como:

- Lingote
- Pepas
- Granallado
- Polvo
- Scrap

La presentación modifica aspectos comerciales, pero no debe cambiar la arquitectura del sistema.

---

# Objetivo funcional

Agregar dos conceptos distintos dentro del expediente y de la interfaz:

## Tipo de material

Valores iniciales:

- Mineral
- Metal físico

## Presentación

Si el tipo es Mineral:

- Mineral en bruto
- Concentrado
- Material seleccionado
- Granza
- Relave
- Otro

Si el tipo es Metal físico:

- Lingote
- Pepas
- Granallado
- Polvo
- Scrap
- Otro

La lista de presentaciones debe cambiar automáticamente según el tipo de material seleccionado.

---

# Comportamiento esperado

Ejemplo 1

Tipo:

Mineral

Presentación disponible:

- Mineral en bruto
- Concentrado
- Granza

Ejemplo 2

Tipo:

Metal físico

Presentación disponible:

- Lingote
- Pepas
- Granallado

Nunca deben mezclarse ambas listas.

---

# Cambios requeridos

## Expediente

Agregar al modelo del expediente:

```javascript
tipoMaterial: "",
presentacionMaterial: ""
```

Estos campos deben almacenarse junto con el resto de la información del expediente.

---

## Plantillas

Las plantillas seguirán siendo técnicas.

No deben depender de la presentación.

Ejemplo:

PLANTILLA_PB_AG

Podrá utilizarse tanto para:

- Mineral en bruto
- Concentrado
- Material seleccionado

---

## Interfaz

Agregar dos controles:

1. Tipo de material
2. Presentación

Cuando cambie el tipo de material, actualizar automáticamente las opciones de presentación.

---

## Preparación para metales físicos

La arquitectura debe dejar preparado el sistema para futuras plantillas como:

- Oro físico
- Plata física
- Estaño físico

Estas plantillas utilizarán las presentaciones correspondientes a metales físicos.

---

## Restricciones

No modificar:

- Motor de cálculos
- Fórmulas
- Validaciones
- Plantillas existentes
- Expedientes ya creados

Solo ampliar la arquitectura y la interfaz.

---

## Verificaciones

- El usuario puede seleccionar el tipo de material.
- La presentación cambia automáticamente según el tipo.
- La selección queda almacenada en el expediente.
- La lógica actual de concentrados continúa funcionando sin cambios.
- No existen errores en consola.

---

## Entregables

1. Indicar los archivos modificados.
2. Explicar cómo quedó la separación entre Tipo de Material y Presentación.
3. Confirmar que las plantillas siguen siendo independientes de la presentación.
4. Confirmar que el expediente guarda ambos datos.
5. Confirmar que el sistema queda preparado para el módulo de metales físicos.
