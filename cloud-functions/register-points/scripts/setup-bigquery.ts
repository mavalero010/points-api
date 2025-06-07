import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setupBigQuery() {
  const bigquery = new BigQuery({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  });

  try {
    // Crear dataset si no existe
    const datasetId = process.env.BIGQUERY_DATASET || 'points_system';
    const [dataset] = await bigquery.createDataset(datasetId, {
      location: 'US',
      description: 'Dataset para almacenar transacciones de puntos',
    });

    console.log(`Dataset ${datasetId} creado o ya existente`);

    // Schema de la tabla
    const schema = {
      fields: [
        { name: 'userId', type: 'STRING', mode: 'REQUIRED', description: 'ID del usuario' },
        { name: 'points', type: 'INTEGER', mode: 'REQUIRED', description: 'Cantidad de puntos' },
        { name: 'transactionId', type: 'STRING', mode: 'REQUIRED', description: 'ID de la transacción' },
        { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED', description: 'Fecha y hora de la transacción' },
        { name: 'status', type: 'STRING', mode: 'REQUIRED', description: 'Estado de la transacción (success/error)' },
        { name: 'errorMessage', type: 'STRING', mode: 'NULLABLE', description: 'Mensaje de error si status es error' },
      ],
    };

    // Crear tabla si no existe
    const tableId = process.env.BIGQUERY_TABLE || 'points_transactions';
    await dataset.createTable(tableId, {
      schema,
      description: 'Tabla de transacciones de puntos',
      timePartitioning: {
        type: 'DAY',
        field: 'timestamp',
      },
    });

    console.log(`Tabla ${tableId} creada o ya existente`);

  } catch (error) {
    console.error('Error al configurar BigQuery:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupBigQuery().catch(console.error);
}

export { setupBigQuery }; 