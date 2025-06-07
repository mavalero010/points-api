import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

function debugEnvVariables() {
  console.log('\n=== DEBUG VARIABLES DE ENTORNO ===');

  const envPath = path.resolve(process.cwd(), '.env');
  console.log('\n1. Verificando archivo .env:');
  console.log('Ruta del archivo:', envPath);
  console.log('¿Existe el archivo?:', fs.existsSync(envPath));

  if (fs.existsSync(envPath)) {
    console.log('\nContenido del archivo .env:');
    console.log(fs.readFileSync(envPath, 'utf8'));
  }

  console.log('\n2. Intentando cargar variables de entorno:');
  const result = dotenv.config();
  console.log('Resultado de dotenv.config():', result);

  console.log('\n3. Variables de entorno disponibles:');
  console.log('process.env:', {
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
    BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,
    NODE_ENV: process.env.NODE_ENV,
  });

  console.log('\n4. Verificando credenciales:');
  const credsPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || '');
  console.log('Ruta de credenciales:', credsPath);
  console.log('¿Existen las credenciales?:', fs.existsSync(credsPath));

  console.log('\n=== FIN DEBUG ===\n');
}

debugEnvVariables();
