# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# Nombre
13_Proforma_Proveedor_Desglose_Tecnico_Comercial.md

## Objetivo

Rediseñar la pantalla de resultados y la futura Proforma Comercial para que muestren un desglose técnico completo, similar al formato utilizado actualmente por Manicone en Excel.

La información debe ser útil tanto para el operador como para el proveedor (minero), pero sin revelar políticas comerciales internas de la empresa.

---

# Contexto

Después de revisar el flujo comercial, se concluyó que el proveedor espera ver un mayor nivel de detalle técnico.

Ocultar demasiada información genera desconfianza durante la negociación.

Por ello, el sistema debe mostrar prácticamente el mismo nivel de detalle que la hoja Excel utilizada actualmente.

---

# Información que DEBE mostrarse

Mantener visibles para operador y proveedor:

- Código de cotización.
- Fecha.
- Proveedor.
- Material.
- Presentación.
- Peso bruto.
- Tara.
- Humedad.
- Peso neto seco.

## Análisis químico

Mostrar:

- Elemento.
- Ley/Pureza.
- Unidad (% o DM).
- Kilos finos / gramos finos.
- Unidad de cotización.

## Cotizaciones

Mostrar únicamente las cotizaciones utilizadas:

- Elemento.
- Precio internacional.
- Unidad.
- Tipo de cambio utilizado.

No mostrar elementos que no participan en el cálculo.

## Valor bruto

Mostrar por elemento:

- Valor bruto individual.
- Total valor bruto.

## Regalías

Mostrar:

- Alícuota aplicada por elemento.
- Regalía por elemento.
- Total regalías.

## Descuentos

Mostrar únicamente descuentos institucionales y legales:

- CNS
- FEDECOMIN
- Administración
- Otros descuentos legales futuros

Mostrar total descuentos.

## Resultado final

Mostrar:

- Valor bruto.
- Regalías.
- Descuentos.
- Líquido pagable.

---

# Información que NO debe mostrarse

Ocultar siempre:

- Porcentaje de pago interno.
- Tabla de pago utilizada.
- Modo de cálculo interno.
- Márgenes comerciales.
- Reglas internas de negociación.

Estas políticas pertenecen únicamente a la administración.

---

# Interfaz

La pantalla de resultados y la futura proforma deben tener prácticamente el mismo contenido.

La diferencia es que la proforma eliminará:

- botones;
- acciones administrativas;
- controles de edición;
- estados internos.

---

# Preparación futura

Diseñar la estructura para que la misma información pueda reutilizarse posteriormente al generar:

- PDF.
- Impresión.
- Exportación.

Evitar duplicar lógica de presentación.

---

# Restricciones

No modificar:

- Motor de cálculo.
- Fórmulas.
- Expedientes.
- Configuración Comercial.

Solo reorganizar la presentación de la información.

---

# Verificaciones

Comprobar que:

1. La pantalla muestra el desglose técnico completo.
2. Solo aparecen elementos realmente utilizados.
3. Las regalías y descuentos se muestran correctamente.
4. No se muestran porcentajes de pago internos.
5. La estructura queda lista para reutilizarse en la futura Proforma PDF.

---

# Entregables

1. Listado de archivos modificados.
2. Explicación del nuevo diseño.
3. Confirmación de que no se exponen reglas comerciales internas.
4. Confirmación de compatibilidad con el futuro módulo de impresión.
