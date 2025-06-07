import { BigQuery } from '@google-cloud/bigquery';

// Configuración
const config = {
  GOOGLE_CLOUD_PROJECT: 'bustling-joy-461901-k5',
  GOOGLE_APPLICATION_CREDENTIALS: './credentials/service-account-key.json',
  BIGQUERY_DATASET: 'points_system',
  BIGQUERY_TABLE: 'points_transactions',
  NODE_ENV: 'development',
};

Object.entries(config).forEach(([key, value]) => {
  process.env[key] = value;
});

console.log('Configuración cargada:', {
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
  BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,
  NODE_ENV: process.env.NODE_ENV,
});

async function testRegisterPoints() {
  console.log('\nIniciando prueba de registro de puntos...\n');

  try {
    const bigquery = new BigQuery({
      projectId: config.GOOGLE_CLOUD_PROJECT,
    });

    const testData = {
      userId: 'test-user-123',
      points: 100,
      transactionId: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'success',
    };

    console.log('Intentando insertar datos:', testData);

    const query = `
      INSERT INTO \`${config.BIGQUERY_DATASET}.${config.BIGQUERY_TABLE}\`
      (userId, points, transactionId, timestamp, status)
      VALUES (@userId, @points, @transactionId, @timestamp, @status)
    `;

    const [job] = await bigquery.createQueryJob({
      query,
      params: testData,
    });

    console.log('\n✅ Consulta de inserción iniciada');
    console.log('Job ID:', job.id);

    await job.getQueryResults();
    console.log('\n✅ Datos insertados exitosamente');

    const [verificationRows] = await bigquery.query({
      query: `SELECT * FROM \`${config.BIGQUERY_DATASET}.${config.BIGQUERY_TABLE}\` 
              WHERE transactionId = @transactionId`,
      params: { transactionId: testData.transactionId },
    });

    console.log('\nDatos recuperados:', verificationRows);
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error);
  }
}

testRegisterPoints().catch(console.error);
