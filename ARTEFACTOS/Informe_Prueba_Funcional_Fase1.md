# Informe de Prueba Funcional Fase 1

# Fecha

2026-07-08

# Objetivo

Ejecutar la prueba funcional completa de la Fase 1 y verificar:

- Nueva cotizacion.
- Creacion de expediente.
- Modelo de valorizacion.
- Captura de datos.
- Calculo.
- Guardado.
- Reapertura.
- Aceptacion y rechazo.
- Generacion de proforma.
- Persistencia local.
- Lectura de cotizaciones y tipo de cambio desde Configuracion.

---

# Alcance de la prueba

La prueba se ejecuto sobre la arquitectura actual de navegador con:

- `localStorage` simulado.
- DOM minimo simulado para las pantallas principales.
- Scripts reales del proyecto cargados en el mismo orden funcional.
- Datos comerciales cargados desde `configuracionComercial`.

No se modifico codigo del sistema durante esta prueba.

---

# Datos de referencia usados

Los valores comerciales fueron cargados desde Configuracion Comercial:

- Pb: 0.90 L.F.
- Ag: 51.43 O.T.
- Dolar oficial: 6.96
- Dolar comercial: 9.00
- Regalia Pb: 0.03
- Regalia Ag: 0.036
- Descuento CNS: 0.018
- Descuento FEDECOMIN: 0.0035
- Descuento Administracion: 0.01

Datos de analisis:

- Peso bruto: 20,000 kg
- Tara: 0 kg
- Humedad: 0.10%
- Pb: 70%
- Ag: 7 DM

---

# Resultado de calculo

Resultado obtenido:

- Valor bruto: Bs 354,096.46
- Regalias: Bs 11,588.61
- Descuentos: Bs 11,154.04
- Liquido pagable: Bs 331,353.81

Resultado esperado de referencia:

- Valor bruto: Bs 354,096.46
- Regalias: Bs 11,588.61
- Descuentos: Bs 11,154.04
- Liquido pagable: Bs 331,353.81

Estado: APROBADO.

---

# Validaciones ejecutadas

| Validacion | Resultado |
|---|---|
| Nueva cotizacion crea expediente | Aprobado |
| Modelo de valorizacion Pb-Ag aplicado | Aprobado |
| Captura de analisis Pb y Ag | Aprobado |
| Cotizaciones provienen de Configuracion | Aprobado |
| Tipo de cambio proviene de Configuracion | Aprobado |
| Valor bruto coincide con Excel | Aprobado |
| Regalias coinciden con Excel | Aprobado |
| Descuentos coinciden con Excel | Aprobado |
| Liquido pagable coincide con Excel | Aprobado |
| Guardado persiste en historial local | Aprobado |
| Reapertura conserva expediente y plantilla | Aprobado |
| Aceptacion de cotizacion | Aprobado |
| Apertura de operacion desde cotizacion aceptada | Aprobado |
| Rechazo de cotizacion con motivo | Aprobado |
| Generacion de proforma con datos calculados | Aprobado |
| Errores de consola durante prueba | Sin errores |
| Alertas inesperadas | Sin alertas |

---

# Evidencia principal

Expediente de prueba:

```text
Codigo: EXP-2026-371681
Plantilla: PLANTILLA_CONC_PB
Modelo: MODELO_PB_AG
Presentacion: CONCENTRADO
Proveedor: COOP001
Material: CONC_PB
```

Proforma generada:

```text
Codigo: EXP-2026-371681
Liquido pagable: Bs 331.353,81
Filas de analisis: 2
```

Reapertura:

```text
Ruta esperada: concentrados.html
Plantilla restaurada: PLANTILLA_CONC_PB
Expediente restaurado: correcto
```

Rechazo:

```text
Estado: COTIZACION_RECHAZADA
Motivo: Precio no aceptado
Persistencia en historial: correcta
```

---

# Errores encontrados

No se encontraron errores funcionales en la prueba automatizada.

No se registraron errores de consola del sistema durante la ejecucion.

---

# Observaciones

La prueba confirma que, con datos comerciales cargados desde Configuracion Comercial, el motor reproduce los resultados de referencia del Excel.

La prueba tambien confirma que el expediente se guarda en `localStorage`, puede reabrirse desde historial, acepta cambios de estado y alimenta la proforma.

Queda recomendado realizar una pasada manual en navegador antes de declarar cierre operativo definitivo de Fase 1, especialmente para revisar experiencia visual, seleccion manual de controles y ausencia de errores en consola real del navegador.

---

# Conclusion

La Fase 1 queda funcionalmente aprobada en prueba automatizada local.

No se detectaron bloqueos para avanzar a una validacion manual final en navegador.
