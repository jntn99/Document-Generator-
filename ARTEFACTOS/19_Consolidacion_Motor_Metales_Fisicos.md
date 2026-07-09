# TIPO DE DOCUMENTO: CONSOLIDACIÓN

# 19_Consolidacion_Motor_Metales_Fisicos.md

## Objetivo

Realizar una revisión integral del módulo **Metales Físicos** para dejarlo estable, coherente y listo para convertirse en el segundo gran motor del ERP, al mismo nivel de madurez que el módulo de Concentrados.

**Este documento NO tiene como objetivo agregar nuevas funcionalidades.**

Su propósito es consolidar todo lo desarrollado, eliminar inconsistencias y asegurar una arquitectura sólida antes de comenzar con los módulos de Operaciones e Inventario.

---

# Objetivos específicos

- Revisar completamente el flujo de Metales Físicos.
- Eliminar errores de funcionamiento.
- Validar todas las fórmulas.
- Revisar la arquitectura.
- Eliminar código duplicado.
- Confirmar que toda la información se guarda correctamente.
- Verificar que el módulo sea escalable.

---

# 1. Auditoría funcional

Revisar todo el flujo:

Nueva Cotización
→ Selección de plantilla
→ Metales físicos
→ Datos del proveedor
→ Agregar ítems
→ Lecturas XRF
→ Cálculo
→ Expediente
→ Proforma
→ Impresión

No debe existir ningún paso roto.

---

# 2. Separación definitiva entre Concentrados y Metales

Confirmar que el módulo de Metales Físicos NO utiliza:

- tablasPago.js
- reglas comerciales de concentrados
- regalías mineras
- lógica de contenido fino de concentrados

Crear una separación clara.

Concentrados:

- tablas de pago
- regalías
- descuentos institucionales

Metales físicos:

- pureza
- finos
- cotización
- tipo de cambio
- descuento comercial propio

Las tablas de pago son exclusivas de concentrados.

---

# 3. Validación del motor de cálculo

Verificar:

- lectura de cotizaciones;
- lectura del tipo de cambio;
- cálculo de finos;
- cálculo USD;
- cálculo BOB;
- descuentos;
- total final.

Comparar con la lógica utilizada actualmente por la empresa.

---

# 4. Revisión del análisis XRF

Confirmar que:

- la pureza proviene de las lecturas XRF;
- no puede ingresarse primero la pureza;
- el promedio se calcula correctamente;
- la diferencia máxima se calcula correctamente;
- el estado sugerido funciona.

---

# 5. Datos del proveedor

Revisar que:

- no existan valores por defecto incorrectos;
- los datos se guarden en expediente;
- no existan duplicaciones;
- los campos opcionales desaparezcan de la proforma cuando estén vacíos.

---

# 6. Expediente

Confirmar que se almacene correctamente:

- proveedor;
- tipo de operación;
- ítems;
- resultados;
- auditoría básica;
- historial;
- estado.

---

# 7. Proforma imprimible

Verificar que:

- pueda imprimirse;
- tenga formato profesional;
- no muestre información interna;
- muestre únicamente datos relevantes para el proveedor.

---

# 8. Código

Realizar una revisión técnica:

- eliminar funciones duplicadas;
- reutilizar servicios comunes;
- revisar nombres de funciones;
- revisar nombres de variables;
- eliminar código muerto;
- revisar organización de carpetas.

No cambiar la arquitectura general sin necesidad.

---

# 9. Rendimiento

Revisar:

- eventos duplicados;
- listeners innecesarios;
- renderizados repetidos;
- cálculos innecesarios.

---

# 10. Consola

Confirmar que:

- no existan errores;
- no existan warnings importantes;
- no existan variables undefined;
- no existan NaN.

---

# 11. Compatibilidad

Confirmar que no se rompió:

- Concentrados.
- Expedientes.
- Configuración Comercial.
- Historial.
- Servicio de cotizaciones.
- Formularios dinámicos.
- Motor de valorización.

---

# 12. Preparación futura

Sin implementarlo todavía, confirmar que el módulo queda preparado para:

- Inventario.
- Operaciones.
- Recepción.
- Laboratorio.
- Usuarios.
- Roles.
- Auditoría completa.
- Exportaciones.

---

# Entregables

Al finalizar entregar:

1. Lista de archivos modificados.
2. Lista de errores encontrados y corregidos.
3. Lista de código duplicado eliminado.
4. Confirmación de separación entre Concentrados y Metales Físicos.
5. Confirmación de que no se utilizan tablas de pago en Metales.
6. Confirmación de funcionamiento del análisis XRF.
7. Confirmación de funcionamiento de la impresión.
8. Confirmación de funcionamiento del expediente.
9. Confirmación de que no existen errores de consola.
10. Sugerencias técnicas detectadas durante la auditoría (sin implementarlas automáticamente).
