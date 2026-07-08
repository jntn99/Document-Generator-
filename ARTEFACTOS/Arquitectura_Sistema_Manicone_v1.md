# Arquitectura del Sistema Manicone v1.0

## 1. Objetivo del sistema

El sistema Manicone debe evolucionar desde un generador de proformas hacia un sistema de gestión comercial minera.

Su objetivo principal será administrar el ciclo completo de una oportunidad comercial minera, desde la primera cotización hasta una posible operación, generación de documentos, pago, inventario, venta o exportación.

---

## 2. Principio central

La entidad principal del sistema será el **Expediente Comercial**.

Toda cotización debe crear un expediente, incluso si la cotización es rechazada.

Una operación comercial solo existirá si la cotización es aceptada.

```text
Cotización ≠ Operación
Cotización + aceptación = Operación
```

---

## 3. Expediente Comercial

Un expediente comercial es el registro maestro de una oportunidad de negocio.

Puede contener:

- datos del proveedor
- material ofrecido
- análisis químico
- cotización calculada
- documentos generados
- historial de cambios
- decisión comercial
- operación, si llega a concretarse

Ejemplo:

```text
EXP-2026-000001
Estado: COTIZACION_RECHAZADA
Proveedor: Cooperativa X
Material: Concentrado de Plomo
Peso ofertado: 20.000 kg
Pb: 55%
Ag: 4 DM
Motivo rechazo: proveedor no aceptó precio
```

---

## 4. Estados del expediente

Estados sugeridos:

```javascript
BORRADOR
COTIZACION_GENERADA
EN_NEGOCIACION
COTIZACION_ACEPTADA
COTIZACION_RECHAZADA
COTIZACION_VENCIDA
OPERACION_ABIERTA
OPERACION_CERRADA
CANCELADA
```

---

## 5. Diferencia entre cotización, operación y documento

### Cotización

Es la etapa donde se analiza una oferta y se calcula un precio.

Puede terminar aceptada, rechazada, vencida o en negociación.

### Operación

Es una compra o venta real en ejecución.

Solo nace desde una cotización aceptada.

### Documento

Es una representación formal de datos del expediente.

Ejemplos:

- proforma
- contrato
- liquidación
- recibo
- orden de pago
- certificado
- PDF

Los documentos no deben duplicar datos. Deben leer información del expediente.

---

## 6. Flujo comercial principal

```text
Nueva cotización
        ↓
Crear expediente comercial
        ↓
Seleccionar tipo de material
        ↓
Seleccionar plantilla
        ↓
Ingresar datos
        ↓
Calcular precio
        ↓
Guardar cotización
        ↓
Decisión comercial
        ├── Rechazar cotización
        ├── Mantener pendiente
        ├── Marcar vencida
        └── Aceptar cotización
                ↓
        Abrir operación comercial
```

---

## 7. Tipos de material

### Concentrados minerales

Ejemplos:

- Concentrado de plomo
- Concentrado de antimonio
- Concentrado de zinc
- Concentrado de oro
- Concentrado de tantalio

Características:

- usa peso bruto
- usa tara
- puede usar humedad
- usa análisis químico
- puede tener elementos principales y opcionales
- puede tener regalías y descuentos

### Metales físicos

Ejemplos:

- Oro físico
- Plata física
- Estaño físico

Presentaciones posibles:

- lingote
- pepas
- granallado
- polvo
- scrap

La presentación no debe ser una plantilla separada. Debe ser una opción dentro de la plantilla del metal.

---

## 8. Elementos principales y opcionales

Cada plantilla puede tener:

```javascript
elementosPrincipales
elementosOpcionales
```

Ejemplo:

```javascript
Concentrado de Plomo:
Principales: PB, AG
Opcionales: ZN, CU, SB, AU, TA
```

Los elementos principales aparecen automáticamente.

Los opcionales se agregan manualmente si aparecen en el análisis.

---

## 9. Validaciones técnicas

La suma de leyes no debe aplicarse a todos los elementos.

Solo deben entrar en el control de 100% los elementos con:

```javascript
controlMasa: true
```

Ejemplo:

```text
Pb 60%
Zn 20%
Cu 5%
Total = 85% OK
```

No entran:

```text
Ag 7 DM
Au 3 g/TM
Ta 250 ppm
```

Tolerancia:

```text
0 a 100%      OK
100 a 100.5%  ADVERTENCIA
>100.5%       ERROR
```

---

## 10. Cotizaciones y tipo de cambio

Las cotizaciones deben estar separadas del motor de cálculo.

El sistema debe soportar dos modos futuros:

- manual
- automático

Recomendación:

- cotizaciones internacionales: futuro automático mediante API
- tipo de cambio local: manual por administrador

---

## 11. Configuración del sistema

La configuración contendrá:

- elementos
- concentrados
- metales físicos
- plantillas
- cooperativas
- compradores
- laboratorios
- transportistas
- cotizaciones
- tipo de cambio
- usuarios
- roles
- parámetros generales

---

## 12. Roles futuros

### Administrador

Puede:

- crear elementos
- editar plantillas
- actualizar cotizaciones
- actualizar tipo de cambio
- administrar usuarios

### Operador

Puede:

- crear cotizaciones
- calcular
- generar documentos
- abrir operaciones autorizadas

### Consulta

Puede:

- ver historial
- revisar reportes
- descargar documentos permitidos

---

## 13. Reportes futuros

El sistema debe permitir reportes como:

### Por cooperativa

- cotizaciones recibidas
- cotizaciones aceptadas
- cotizaciones rechazadas
- ley promedio
- peso promedio ofertado
- motivo frecuente de rechazo

### Por mineral

- cantidad de ofertas
- tasa de aceptación
- ley promedio
- peso ofertado
- peso comprado

### Por operación

- margen
- rentabilidad
- descuentos
- pagos
- estado

---

## 14. Documentos futuros

Desde un expediente se podrán generar:

- proforma
- contrato
- liquidación
- recibo
- orden de pago
- factura
- lista de empaque
- certificado de calidad
- documentos de exportación

---

## 15. Reglas de arquitectura

1. No duplicar datos entre documentos.
2. El expediente es la fuente de verdad.
3. La cotización puede existir sin operación.
4. La operación solo nace desde una cotización aceptada.
5. Las plantillas definen estructura, no datos reales.
6. Las leyes, pesos y cotizaciones usadas pertenecen al expediente.
7. El motor debe ser configurable.
8. Los catálogos deben poder migrar a base de datos en el futuro.
9. No tocar fórmulas sin validar contra el Excel.
10. Todo cambio grande debe documentarse en un archivo .md antes de implementarse.

---

## 16. Próxima fase recomendada

Después de congelar esta arquitectura, los siguientes pasos serán:

1. Mostrar expediente actual en pantalla.
2. Implementar botones de estado:
   - guardar cotización
   - rechazar cotización
   - aceptar cotización
   - abrir operación
3. Guardar expedientes en historial local temporal.
4. Implementar elementos opcionales.
5. Implementar metales físicos.
6. Preparar base de datos.
