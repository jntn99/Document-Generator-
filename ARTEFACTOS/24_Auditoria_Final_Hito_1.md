# TIPO DE DOCUMENTO: AUDITORÍA INTEGRAL

# 24_Auditoria_Final_Hito_1.md

## Objetivo

Realizar la auditoría funcional final del Hito 1 (Núcleo Comercial) antes de iniciar el Hito 2 (Operaciones).

## Regla general

Todo cambio debe verificarse también en:
- Concentrados
- Metales físicos
- Expedientes
- Historial
- Configuración
- Proformas
- Motor de valorización
- Catálogos
- Formularios dinámicos
- Impresión

Al finalizar indicar qué módulos fueron probados.

---

## 1. Preparar estructura del expediente

Agregar:

- creadoPor
- creadoPorNombre
- fechaCreacion
- ultimoModificadoPor
- ultimoModificadoPorNombre
- fechaUltimaModificacion
- responsableActual
- responsableActualNombre
- version

Usar temporalmente usuarioActual.

El expediente pertenece a la empresa, no al usuario.

Preparar para futuros permisos:
- Operador: solo sus expedientes.
- Supervisor: expedientes de su equipo.
- Administrador: todos.

---

## 2. Flujo de estados

Estados:
- BORRADOR
- COTIZACION_GENERADA
- EN_NEGOCIACION
- COTIZACION_ACEPTADA
- COTIZACION_RECHAZADA
- COTIZACION_VENCIDA
- OPERACION_ABIERTA
- COMPRA_FINALIZADA

Mostrar únicamente acciones válidas para cada estado.

---

## 3. Tipo de cambio

Eliminar lógica de T/C paralelo y comercial.

Utilizar únicamente **Tipo de Cambio Vigente**.

Debe provenir de Configuración Comercial y guardarse dentro del expediente.

Revisar todas las fórmulas para asegurar compatibilidad.

---

## 4. Configuración

Revisar y completar:
- Modelos de valorización.
- Minerales.
- Presentaciones.
- Cotizaciones.
- Regalías.
- Descuentos.
- Tipo de Cambio Vigente.

---

## 5. Concentrados

Corregir:
- proveedor duplicado;
- sincronización automática del proveedor;
- actualizar título al agregar elementos;
- eliminar elementos agregados;
- adaptar fórmulas al nuevo tipo de cambio;
- mostrar desglose de regalías;
- agregar fecha de recepción y fecha de liquidación;
- mejorar proforma profesional.

---

## 6. Metales físicos

Corregir:
- datos generales;
- datos del proveedor;
- eliminar T/C visible;
- eliminar Total al 90%;
- eliminar ítems agregados;
- validar metal/presentación;
- revisar todas las fórmulas;
- XRF en tiempo real;
- proforma profesional;
- simplificar botones.

---

## 7. Historial

Agregar:
- monto pagado;
- usuario;
- fecha;
- estado;
- mineral.

Optimizar búsqueda.

Verificar generación única de códigos.

Eliminar registros duplicados.

---

## 8. Proformas

Mostrar:
- logo;
- datos corporativos;
- fechas;
- proveedor;
- observaciones;
- firmas;
- validez.

No mostrar información interna.

---

## 9. Usabilidad

- Reducir clics.
- Automatizar datos repetidos.
- Autocompletado.
- Mostrar solo acciones válidas.

---

## 10. Navegación

Revisar navegación completa del ERP.

---

## 11. Sinergia

Cada cambio debe revisarse en todo el ERP.

No aceptar correcciones que rompan otros módulos.

---

## Entregables

1. Archivos modificados.
2. Módulos probados.
3. Errores corregidos.
4. Compatibilidad confirmada.
5. Confirmación de cierre funcional del Hito 1.
