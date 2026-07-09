# Propuesta de Arquitectura para Integracion SENARECOM

# Tipo de documento

ARQUITECTURA.

No se implementa codigo en esta etapa.

---

# Objetivo

Preparar el sistema para una futura integracion con tablas oficiales de SENARECOM sin acoplar el motor de calculo a una fuente externa especifica.

La integracion debe permitir que los valores oficiales convivan con datos manuales y, mas adelante, con APIs externas, manteniendo una sola forma de lectura para el motor.

---

# Principio central

El motor de calculo nunca debe saber si un dato vino de:

- Manual
- SENARECOM
- API externa

El motor solo debe recibir datos comerciales ya normalizados desde Configuracion Comercial.

La fuente de datos pertenece a la capa de configuracion, sincronizacion y auditoria, no a las formulas.

---

# Datos que dependeran de SENARECOM

Los datos candidatos a venir desde SENARECOM son aquellos que tengan caracter oficial, normativo o de referencia regulatoria:

- Tablas oficiales aplicables a regalias mineras.
- Alicuotas oficiales por mineral, metal o elemento.
- Parametros normativos de liquidacion cuando correspondan.
- Codigos oficiales de minerales, productos o sustancias.
- Vigencias oficiales de tablas regulatorias.
- Fechas de publicacion o actualizacion.
- Identificador de resolucion, norma, fuente o version oficial.
- Posibles parametros SENARECOM asociados a comercializacion, declaracion o control documental.

Estos datos deben entrar al sistema como registros versionados y auditables.

No deben reemplazar automaticamente un calculo ya guardado en un expediente historico.

---

# Datos que seguiran siendo manuales

Seguiran siendo manuales los datos que dependen de operacion interna, negociacion o decision comercial de Manicone:

- Cotizaciones internacionales cargadas manualmente si no hay fuente automatica activa.
- Tipo de cambio comercial.
- Fuente comercial usada por el operador cuando no exista integracion.
- Usuario responsable de la actualizacion.
- Descuentos internos.
- Penalidades comerciales internas.
- Parametros negociados con proveedor.
- Tolerancias operativas internas.
- Decimales y formato de presentacion.
- Activacion o desactivacion de una fuente de cotizacion.
- Seleccion final de que fuente usar cuando existan varias disponibles.

El tipo de cambio oficial puede venir de una fuente oficial en el futuro, pero el tipo de cambio comercial debe permanecer editable manualmente.

---

# Concepto: Proveedor de Cotizaciones

Se propone introducir el concepto `Proveedor de Cotizaciones`.

Un proveedor de cotizaciones no es un proveedor minero. Es la fuente desde donde el sistema obtiene valores comerciales o regulatorios.

## Fuentes iniciales

### Manual

Fuente administrada por el usuario desde Configuracion Comercial.

Responsabilidades:

- Permitir captura directa de precios, unidades, vigencias y fuentes textuales.
- Guardar usuario y fecha de actualizacion.
- Mantener historial local.
- Ser la fuente de respaldo si no hay integracion disponible.

### SENARECOM

Fuente oficial regulatoria.

Responsabilidades futuras:

- Importar o sincronizar tablas oficiales.
- Guardar version, vigencia, fecha de publicacion y referencia normativa.
- Validar que los registros oficiales tengan estructura esperada.
- Marcar datos como oficiales y no editables directamente, salvo por procesos de sincronizacion.

### API externa

Fuente automatizada no regulatoria, por ejemplo mercados internacionales, metales o divisas.

Responsabilidades futuras:

- Consultar precios desde servicios externos.
- Guardar fecha/hora de consulta.
- Mantener trazabilidad de proveedor, endpoint o identificador de respuesta.
- Permitir fallback manual si falla la API.

---

# Arquitectura propuesta

Flujo conceptual:

```text
Proveedor de Cotizaciones
  - Manual
  - SENARECOM
  - API externa

        |
        v

Normalizador de Datos Comerciales

        |
        v

Configuracion Comercial
  - cotizaciones vigentes
  - tipo de cambio
  - parametros
  - regalias
  - descuentos
  - historial y auditoria

        |
        v

Motor de Calculo

        |
        v

Expediente Comercial
  - datos usados en el calculo
  - snapshot de cotizaciones
  - snapshot de parametros
  - resultado
```

---

# Separacion de responsabilidades

## Proveedor de Cotizaciones

Obtiene datos desde una fuente concreta.

No calcula liquidaciones.

No modifica expedientes directamente.

## Normalizador de Datos Comerciales

Convierte cada fuente al formato interno del sistema.

Ejemplo de salida normalizada:

```text
elementoId
precio
unidad
fechaVigencia
fuente
proveedorCotizacionId
tipoFuente
usuario
fechaActualizacion
versionFuente
referenciaOficial
```

## Configuracion Comercial

Administra los datos que el motor puede usar.

Debe poder indicar:

- Fuente activa por dato.
- Valor vigente.
- Historial.
- Estado de sincronizacion.
- Fecha de vigencia.
- Usuario o proceso que actualizo el dato.

## Motor de Calculo

Consume solo la configuracion normalizada.

No consulta SENARECOM.

No consulta APIs externas.

No decide que fuente comercial usar.

## Expediente Comercial

Guarda el snapshot de los valores usados al calcular.

Esto evita que una actualizacion futura de SENARECOM cambie resultados historicos.

---

# Modelo conceptual de datos

## proveedorCotizacion

Campos propuestos:

- id
- nombre
- tipoFuente: MANUAL, SENARECOM, API_EXTERNA
- activo
- prioridad
- descripcion
- requiereSincronizacion
- ultimaSincronizacion
- estadoSincronizacion

## datoComercialNormalizado

Campos propuestos:

- id
- proveedorCotizacionId
- tipoDato: COTIZACION, TIPO_CAMBIO, REGALIA, DESCUENTO, PARAMETRO
- elementoId
- precio
- porcentaje
- unidad
- moneda
- fechaVigenciaDesde
- fechaVigenciaHasta
- fuenteTexto
- referenciaOficial
- versionFuente
- editable
- usuarioActualizacion
- fechaActualizacion

## configuracionComercialVigente

Campos propuestos:

- cotizaciones
- tipoCambio
- parametros
- regalias
- descuentos
- fuenteActivaPorDato
- fechaActualizacion
- versionConfiguracion

---

# Reglas de seleccion de fuente

La seleccion de fuente debe ocurrir antes del calculo.

Reglas recomendadas:

- Si un dato oficial SENARECOM esta activo y vigente, puede ser candidato principal para datos regulatorios.
- Si SENARECOM no tiene dato vigente, se usa Manual como respaldo autorizado.
- Para precios internacionales, Manual o API externa pueden ser fuentes activas segun configuracion.
- Para tipo de cambio comercial, Manual debe seguir disponible.
- Para tipo de cambio oficial, se puede permitir fuente oficial futura.
- El usuario administrador debe poder ver que fuente esta activa para cada dato.

El motor recibe el valor final, no la lista de candidatos.

---

# Impacto sobre el modulo Configuracion Comercial

El modulo actual de Configuracion Comercial debe evolucionar hacia una consola de fuentes.

Nuevas secciones futuras:

- Proveedores de cotizaciones.
- Fuente activa por tipo de dato.
- Historial de sincronizaciones.
- Comparacion entre valor manual y valor oficial.
- Estados de vigencia.
- Alertas de datos vencidos.
- Boton de sincronizacion SENARECOM cuando exista integracion.

La pantalla actual puede seguir siendo el punto de entrada manual.

---

# Impacto sobre el motor de calculo

El motor no debe cambiar de forma conceptual.

Solo debe cumplirse esta regla:

```text
motor -> lee configuracion normalizada -> calcula
```

No debe existir:

```text
motor -> SENARECOM
motor -> API externa
motor -> reglas por nombre de fuente
```

---

# Impacto sobre expedientes

Cada expediente debe guardar los valores usados en el momento del calculo.

Debe guardarse, como minimo:

- Cotizaciones usadas.
- Tipo de cambio usado.
- Regalias usadas.
- Descuentos usados.
- Parametros usados.
- Fuente activa de cada dato.
- Fecha de vigencia.
- Fecha de calculo.

Esto permite auditoria y evita recalculos historicos accidentales.

---

# Plan de migracion por etapas

## Fase 1: Documentar y estabilizar Configuracion Comercial

Objetivo:

Confirmar que todos los valores comerciales usados por el motor provienen de Configuracion Comercial.

Entregables:

- Inventario de datos comerciales actuales.
- Confirmacion de que el motor no tiene valores comerciales internos.
- Prueba funcional con datos manuales.

No integrar SENARECOM todavia.

## Fase 2: Agregar el concepto Proveedor de Cotizaciones

Objetivo:

Incorporar el modelo conceptual de fuentes sin sincronizacion real.

Entregables:

- Fuente Manual como proveedor por defecto.
- Campo tipoFuente.
- Fuente activa por dato.
- Estructura preparada para SENARECOM y API externa.

El motor debe seguir leyendo la misma configuracion normalizada.

## Fase 3: Agregar historial y snapshots completos

Objetivo:

Garantizar auditoria antes de conectar fuentes oficiales.

Entregables:

- Historial de cambios comerciales.
- Snapshot de configuracion usada en cada expediente.
- Registro de usuario, fecha y fuente.

## Fase 4: Cargar tablas SENARECOM de forma manual/importada

Objetivo:

Probar datos oficiales sin automatizacion.

Entregables:

- Importacion manual o carga estructurada de tablas SENARECOM.
- Validacion de vigencias.
- Comparacion contra valores manuales.
- Activacion controlada de fuente SENARECOM para datos regulatorios.

## Fase 5: Sincronizacion SENARECOM

Objetivo:

Conectar una fuente oficial si existe mecanismo tecnico disponible.

Entregables:

- Servicio de sincronizacion.
- Estado de ultima sincronizacion.
- Manejo de errores.
- Registro de version oficial.
- Proceso de aprobacion antes de activar nuevos datos.

## Fase 6: API externa para mercados

Objetivo:

Automatizar cotizaciones internacionales cuando se defina un proveedor externo.

Entregables:

- Proveedor API externa.
- Normalizador de precios.
- Control de vigencia.
- Fallback manual.

---

# Riesgos

- Cambiar valores vigentes podria alterar calculos si no se guardan snapshots en expedientes.
- SENARECOM puede publicar datos con estructura distinta a la esperada.
- Una fuente oficial vencida podria usarse por error si no existe control de vigencia.
- El usuario podria no distinguir entre precio comercial, alicuota regulatoria y parametro interno.
- Acoplar el motor directamente a SENARECOM haria mas dificil probar y mantener el sistema.
- Automatizar demasiado pronto puede introducir errores silenciosos en liquidaciones.

---

# Reglas de seguridad arquitectonica

- No conectar SENARECOM directamente al motor.
- No recalcular expedientes historicos con datos nuevos salvo accion explicita.
- No reemplazar datos manuales sin confirmacion.
- No mezclar proveedor minero con proveedor de cotizaciones.
- No eliminar la fuente Manual.
- No implementar base de datos hasta que el modelo local este validado.
- No usar una API externa como fuente regulatoria oficial.

---

# Criterios para autorizar implementacion futura

Antes de implementar codigo de SENARECOM se debe confirmar:

- Que datos oficiales exactos se recibiran.
- En que formato se recibiran.
- Como se define la vigencia.
- Que datos son obligatorios y cuales opcionales.
- Quien aprueba activar una tabla nueva.
- Que ocurre si la fuente falla.
- Como se audita un cambio.
- Como se guarda el snapshot en el expediente.

---

# Conclusion

La integracion SENARECOM debe entrar como una fuente dentro de Configuracion Comercial, no como dependencia del motor.

La arquitectura recomendada es:

```text
Fuente externa o manual -> normalizacion -> configuracion vigente -> motor -> expediente
```

Este enfoque permite usar datos oficiales en el futuro sin romper liquidaciones actuales, sin duplicar formulas y sin perder trazabilidad comercial.
