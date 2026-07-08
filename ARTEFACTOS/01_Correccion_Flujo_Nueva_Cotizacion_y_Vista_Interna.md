# TIPO DE DOCUMENTO: IMPLEMENTACIÓN

# Objetivo
Reorganizar el flujo para que el usuario trabaje con una **Nueva Cotización** y no con una operación.

# Cambios
1. Renombrar "Nueva operación" por "Nueva cotización".
2. Reemplazar "Plantilla técnica" por "Modelo de valorización" en toda la interfaz.
3. Mantener las plantillas únicamente como mecanismo interno.
4. La pantalla actual será la **Pantalla Interna de Cotización**.
5. Preparar una futura **Proforma imprimible** independiente.
6. Mover historial, estados y acciones administrativas fuera de la vista imprimible.
7. Mantener el motor de cálculo intacto.

# Flujo esperado
Menú → Nueva cotización → Tipo de material → Presentación → Modelo de valorización → Crear expediente → Pantalla interna → Calcular → Guardar → Generar proforma.

# Restricciones
No modificar fórmulas, motor, expedientes ni cálculos.

# Entregables
Archivos modificados, explicación del flujo y confirmación de compatibilidad.
