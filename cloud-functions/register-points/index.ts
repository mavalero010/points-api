import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config();

console.log('¿Existe .env en ./ ?', fs.existsSync('./.env'));
console.log('¿Existe .env en ruta absoluta?', fs.existsSync(path.resolve(__dirname, '.env')));

// Inicializar Firebase Admin
admin.initializeApp();

// Configuración
const config = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  dataset: process.env.BIGQUERY_DATASET || 'points_system',
  table: process.env.BIGQUERY_TABLE || 'points_transactions',
  isDevelopment: process.env.NODE_ENV === 'development'
};

// Interfaces
interface PointsTransaction {
  userId: string;
  points: number;
  transactionId: string;
  timestamp: string;
  type: 'earn' | 'redeem';
  status: 'success' | 'error';
  processedAt: string;
}

interface RegisterPointsRequest {
  userId: string;
  points: number;
  transactionId: string;
}

// Configuración de Express
const app = express();
app.use(cors());
app.use(express.json());

// Simulación de BigQuery (documentada para producción)
const simulateBigQueryInsert = async (transaction: PointsTransaction): Promise<boolean> => {
  try {
    functions.logger.info('Simulando inserción en BigQuery:', {
      projectId: config.projectId,
      dataset: config.dataset,
      table: config.table,
      transaction
    });

    // En producción, aquí iría:
    // const bigquery = new BigQuery();
    // await bigquery.dataset(config.dataset).table(config.table).insert([transaction]);

    // Simulamos un pequeño delay para hacer la simulación más realista
    await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  } catch (error) {
    functions.logger.error('Error en simulación de BigQuery:', error);
    return false;
  }
};

// Endpoint principal
app.post('/', async (req, res) => {
  try {
    const { userId, points, transactionId } = req.body as RegisterPointsRequest;

    // Validaciones
    if (!userId || typeof points !== 'number' || !transactionId) {
      functions.logger.warn('Datos inválidos:', { userId, points, transactionId });
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        required: ['userId', 'points', 'transactionId'],
        received: { userId, points, transactionId }
      });
    }

    // Crear objeto de transacción
    const transaction: PointsTransaction = {
      userId,
      points,
      transactionId,
      timestamp: new Date().toISOString(),
      type: points > 0 ? 'earn' : 'redeem',
      status: 'success',
      processedAt: new Date().toISOString()
    };

    // Registrar en BigQuery (simulado)
    const success = await simulateBigQueryInsert(transaction);

    if (!success) {
      functions.logger.error('Error al registrar transacción:', transaction);
      return res.status(500).json({
        success: false,
        error: 'Error al registrar la transacción en BigQuery'
      });
    }

    // Log de éxito
    functions.logger.info('Transacción registrada exitosamente:', {
      transactionId,
      userId,
      points,
      type: transaction.type
    });

    // Responder éxito
    return res.status(200).json({
      success: true,
      message: 'Puntos registrados correctamente',
      data: transaction
    });

  } catch (error) {
    functions.logger.error('Error en registerPoints:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Exportar la función HTTP
export const registerPoints = functions.https.onRequest({
  cors: true,
  region: "us-central1",
  minInstances: 0,
  maxInstances: 10,
  memory: "256MiB",
  timeoutSeconds: 60,
}, app);

// Asegurarnos que la función se exporta correctamente
export { registerPoints as default }; 