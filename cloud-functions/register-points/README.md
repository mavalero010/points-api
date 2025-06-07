# Points Register Cloud Function

Esta Cloud Function registra las transacciones de puntos simulando el almacenamiento en BigQuery para análisis y reportes.

> **Nota**: Esta implementación utiliza una simulación de BigQuery para evitar la necesidad de activar facturación en Google Cloud. En un entorno de producción, se reemplazaría con la implementación real de BigQuery.

## Configuración

1. Instala las dependencias:
```bash
npm install
```

2. Compila el código TypeScript:
```bash
npm run build
```

3. Despliega la función:
```bash
npm run deploy
```

## Uso

La función espera una solicitud POST con el siguiente formato:

```json
{
  "userId": "string",
  "points": number,
  "transactionId": "string"
}
```

Ejemplo de uso con curl:
```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/register-points \
  -H "Content-Type: application/json" \
  -d '{"userId": "123", "points": 100, "transactionId": "tx_123"}'
```

## Simulación de BigQuery

La función simula el almacenamiento en BigQuery con las siguientes características:

- Registra las transacciones en logs para simulación
- Mantiene la misma estructura de datos que se usaría en BigQuery
- Simula un pequeño delay para emular el comportamiento real
- Registra logs detallados de cada transacción

### Estructura de Datos Simulada

La función simula el almacenamiento con la siguiente estructura:
- `userId`: ID del usuario (STRING)
- `points`: Cantidad de puntos (INTEGER)
- `transactionId`: ID de la transacción (STRING)
- `timestamp`: Fecha y hora de la transacción (TIMESTAMP)
- `type`: Tipo de transacción ('earn' o 'redeem')
- `status`: Estado de la transacción ('success' o 'error')
- `processedAt`: Fecha y hora de procesamiento

### Implementación Real (Documentación)

En un entorno de producción, la implementación real utilizaría:
1. Conexión directa a BigQuery
2. Particionamiento por fecha
3. Clustering por userId
4. Vistas materializadas para resúmenes

Para implementar la versión real, se necesitaría:
1. Activar facturación en Google Cloud
2. Configurar credenciales de servicio
3. Crear dataset y tabla en BigQuery
4. Reemplazar la función `simulateBigQueryInsert` con la implementación real

## Logs y Monitoreo

La función registra logs detallados que incluyen:
- Información de la transacción
- Errores y excepciones
- Tiempo de procesamiento
- Estado de la operación

Puedes ver los logs en la consola de Firebase Functions.

## Estructura de Datos

La función almacena los datos en BigQuery con la siguiente estructura:
- `userId`: ID del usuario (STRING)
- `points`: Cantidad de puntos (INTEGER)
- `transactionId`: ID de la transacción (STRING)
- `timestamp`: Fecha y hora de la transacción (TIMESTAMP)

## Vistas Disponibles

- `daily_points_summary`: Resumen diario de puntos por usuario
  - Campos: userId, date, total_points, transaction_count

## Optimizaciones

- La tabla está particionada por fecha para mejorar el rendimiento de las consultas
- Se utiliza clustering por userId para optimizar las consultas por usuario
- La vista materializada proporciona acceso rápido a resúmenes diarios 