# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

Objetivo: Crear el módulo Configuración Comercial para administrar manualmente cotizaciones internacionales, tipo de cambio, parámetros generales y tablas de descuentos sin modificar el código.

Implementar:
- Tabla editable de cotizaciones (Pb, Ag, Au, Zn, Cu, Sb, Sn, Ta).
- Campos: precio, unidad, fecha de vigencia, fuente, usuario y fecha de actualización.
- Tipo de cambio Oficial y Comercial con historial.
- Parámetros: moneda, decimales, tolerancia de leyes y humedad máxima.
- Tablas de regalías y descuentos.
- Persistencia en localStorage, preparada para base de datos.
- El motor debe leer todos estos valores desde Configuración.

No dejar valores comerciales escritos en el código.
