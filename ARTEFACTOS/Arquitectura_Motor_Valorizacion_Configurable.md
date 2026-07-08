# Arquitectura del Motor de Valorización Configurable

# Objetivo

Evolucionar el sistema desde un conjunto de plantillas de cálculo hacia un **Motor de Valorización Configurable**, donde las reglas comerciales y técnicas no dependan del código fuente sino de modelos configurables.

Este documento define la dirección arquitectónica del proyecto. No busca cambiar el funcionamiento actual, sino preparar el sistema para crecer sin reescribir el motor de cálculo.

---

# Contexto

Actualmente el sistema utiliza:

- Plantillas técnicas
- Elementos
- Fórmulas
- Cotizaciones
- Descuentos

Esto funciona para unos pocos materiales, pero cada nuevo producto requeriría modificar el código.

El objetivo es que, en el futuro, agregar un nuevo producto sea principalmente una tarea de configuración.

---

# Principio fundamental

El motor de cálculo **no debe preguntar qué mineral es**.

Debe preguntar:

> ¿Qué Modelo de Valorización utiliza este expediente?

El modelo responderá cómo debe calcularse.

---

# ¿Qué es un Modelo de Valorización?

Es un conjunto de reglas que describe cómo valorar comercialmente un material.

Cada modelo define:

- Nombre visible
- Código
- Plantilla técnica asociada
- Método de valorización
- Elementos principales
- Elementos opcionales
- Elementos pagables
- Elementos penalizables
- Reglas de contenido fino
- Conversión de unidades
- Cotizaciones requeridas
- Regalías aplicables
- Descuentos aplicables
- Parámetros especiales
- Estado (activo/inactivo)

---

# Arquitectura propuesta

Expediente Comercial

↓

Modelo de Valorización

↓

Motor de Cálculo

↓

Resultados

El expediente no conoce las fórmulas.

El expediente únicamente referencia un modelo.

---

# Responsabilidades

## Expediente

Guarda los datos reales de la negociación.

Nunca contiene reglas de negocio.

## Modelo de valorización

Define las reglas.

No almacena datos comerciales.

## Motor

Lee el expediente.

Lee el modelo.

Ejecuta los cálculos.

Devuelve resultados.

---

# Beneficios

- Agregar nuevos productos sin reescribir el motor.
- Mantener una única lógica de cálculo.
- Facilitar pruebas y auditorías.
- Reducir duplicación de código.
- Preparar integración con una base de datos.

---

# Catálogo futuro

Agregar en Configuración:

Modelos de valorización

Cada registro deberá permitir configurar:

- Nombre
- Código
- Tipo de material
- Presentaciones compatibles
- Método de valorización
- Elementos principales
- Elementos opcionales
- Reglas especiales
- Activo

No implementar la interfaz completa todavía.

Solo preparar la arquitectura.

---

# Restricciones

No modificar:

- Fórmulas existentes.
- Motor actual.
- Expedientes.
- Validaciones.

Solo reorganizar la arquitectura para que el motor dependa de modelos configurables en el futuro.

---

# Plan de evolución

Fase 1
- Mantener plantillas actuales.

Fase 2
- Introducir Modelos de Valorización.

Fase 3
- Hacer que el motor lea el modelo.

Fase 4
- Permitir crear modelos desde Configuración.

Fase 5
- Eliminar dependencias directas entre el motor y las plantillas técnicas.

---

# Entregables

1. Analizar la arquitectura actual.
2. Identificar qué componentes deberán migrar al Modelo de Valorización.
3. Proponer una estructura de archivos para este nuevo módulo.
4. No romper el funcionamiento actual.
5. Dejar documentado el plan de migración por etapas antes de implementar cambios importantes.
