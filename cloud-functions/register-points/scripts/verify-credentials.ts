import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyCredentials() {
  console.log('Verificando configuración...\n');

  // Verificar variables de entorno
  console.log('Variables de entorno:');
  console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);
  console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log('BIGQUERY_DATASET:', process.env.BIGQUERY_DATASET);
  console.log('BIGQUERY_TABLE:', process.env.BIGQUERY_TABLE);
  console.log('\n');

  try {
    // Verificar conexión con BigQuery
    const bigquery = new BigQuery();
    const [datasets] = await bigquery.getDatasets();
    
    console.log('Conexión exitosa con BigQuery');
    console.log('Datasets disponibles:');
    datasets.forEach(dataset => console.log(`- ${dataset.id}`));

    // Verificar acceso al dataset específico
    const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET || '');
    const [exists] = await dataset.exists();
    
    if (exists) {
      console.log(`\nDataset '${process.env.BIGQUERY_DATASET}' encontrado`);
      
      // Verificar acceso a la tabla
      const table = dataset.table(process.env.BIGQUERY_TABLE || '');
      const [tableExists] = await table.exists();
      
      if (tableExists) {
        console.log(`Tabla '${process.env.BIGQUERY_TABLE}' encontrada`);
      } else {
        console.log(`⚠️ Tabla '${process.env.BIGQUERY_TABLE}' no encontrada`);
      }
    } else {
      console.log(`\n⚠️ Dataset '${process.env.BIGQUERY_DATASET}' no encontrado`);
    }

  } catch (error) {
    console.error('\n❌ Error al verificar credenciales:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verifyCredentials().catch(console.error);
}

export { verifyCredentials }; 