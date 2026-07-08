# Ajustes de Robustez para Expedientes Comerciales

## Objetivo

Mejorar la robustez del módulo `expedientes.js` sin modificar la arquitectura ni el flujo funcional del sistema.

## Cambios requeridos

### 1. Persistencia automática

Después de cualquier cambio de estado ejecutar:

```javascript
guardarExpedienteActual(expediente);
```

Aplicar en:

- marcarCotizacionAceptada()
- marcarCotizacionRechazada()
- marcarCotizacionVencida()
- abrirOperacionDesdeCotizacion()

---

### 2. Proteger historial

Antes de usar:

```javascript
expediente.historial.push(...)
```

verificar:

```javascript
if (!expediente.historial) {
    expediente.historial = [];
}
```

---

### 3. Proteger negociación

Antes de acceder a:

```javascript
expediente.negociacion
```

asegurar:

```javascript
if (!expediente.negociacion) {
    expediente.negociacion = {};
}
```

---

### 4. Proteger resultados

En `actualizarExpedienteDesdeLiquidacion()` no asumir que:

```javascript
liquidacion.resultado
```

siempre existe.

Usar valores por defecto.

---

### 5. Crear función reutilizable

Crear:

```javascript
guardarYRegistrar(expediente, descripcion, estado)
```

Debe:

1. Cambiar estado (si corresponde).
2. Agregar entrada al historial.
3. Guardar el expediente.

Reutilizarla para evitar código duplicado.

---

## Verificaciones

Comprobar:

- Aceptar cotización.
- Rechazar cotización.
- Marcar vencida.
- Abrir operación.

Después de cada acción:

- Recargar la página.
- Confirmar que el estado permanece.
- Confirmar que el historial sigue creciendo.

---

## Restricciones

No modificar:

- modeloExpediente.js
- estadosExpediente.js
- concentrados
- formulario
- motor de cálculos

Solo mejorar `expedientes.js`.

---

## Entregables

1. Indicar funciones modificadas.
2. Confirmar que el expediente se guarda automáticamente tras cada cambio de estado.
3. Confirmar que historial y negociación ya no generan errores por objetos inexistentes.
4. Confirmar que no existen errores de consola.
