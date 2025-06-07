import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

console.log('¿Existe .env en ./ ?', fs.existsSync('./.env'));
console.log('¿Existe .env en ruta absoluta?', fs.existsSync(path.resolve(__dirname, '.env')));

admin.initializeApp();

const config = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  dataset: process.env.BIGQUERY_DATASET || 'points_system',
  table: process.env.BIGQUERY_TABLE || 'points_transactions',
  isDevelopment: process.env.NODE_ENV === 'development',
};

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

const app = express();
app.use(cors());
app.use(express.json());

const simulateBigQueryInsert = async (transaction: PointsTransaction): Promise<boolean> => {
  try {
    functions.logger.info('Simulando inserción en BigQuery:', {
      projectId: config.projectId,
      dataset: config.dataset,
      table: config.table,
      transaction,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    return true;
  } catch (error) {
    functions.logger.error('Error en simulación de BigQuery:', error);
    return false;
  }
};

app.post('/', async (req, res) => {
  try {
    const { userId, points, transactionId } = req.body as RegisterPointsRequest;

    if (!userId || typeof points !== 'number' || !transactionId) {
      functions.logger.warn('Datos inválidos:', { userId, points, transactionId });
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        required: ['userId', 'points', 'transactionId'],
        received: { userId, points, transactionId },
      });
    }

    const transaction: PointsTransaction = {
      userId,
      points,
      transactionId,
      timestamp: new Date().toISOString(),
      type: points > 0 ? 'earn' : 'redeem',
      status: 'success',
      processedAt: new Date().toISOString(),
    };

    const success = await simulateBigQueryInsert(transaction);

    if (!success) {
      functions.logger.error('Error al registrar transacción:', transaction);
      return res.status(500).json({
        success: false,
        error: 'Error al registrar la transacción en BigQuery',
      });
    }

    functions.logger.info('Transacción registrada exitosamente:', {
      transactionId,
      userId,
      points,
      type: transaction.type,
    });

    return res.status(200).json({
      success: true,
      message: 'Puntos registrados correctamente',
      data: transaction,
    });
  } catch (error) {
    functions.logger.error('Error en registerPoints:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
});

export const registerPoints = functions.https.onRequest(
  {
    cors: true,
    region: 'us-central1',
    minInstances: 0,
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  app,
);

export { registerPoints as default };
