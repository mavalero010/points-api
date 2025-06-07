import * as functions from 'firebase-functions/v1';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.test.env');
console.log('📁 Cargando variables de entorno desde:', envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('❌ Error cargando .env:', result.error);
} else {
  console.log('✅ Variables de entorno cargadas:', {
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    BIGQUERY_DATASET: process.env.BIGQUERY_DATASET,
    BIGQUERY_TABLE: process.env.BIGQUERY_TABLE,
    NODE_ENV: process.env.NODE_ENV,
  });
}

const config = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentialsPath:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/service-account-key.json',
  dataset: process.env.BIGQUERY_DATASET || 'points_system',
  table: process.env.BIGQUERY_TABLE || 'points_transactions',
  isDevelopment: process.env.NODE_ENV === 'development',
};

interface PointsTransaction {
  userId: string;
  points: number;
  transactionId: string;
  timestamp: string;
  status: 'success' | 'error';
}

const transactions: PointsTransaction[] = [];

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de logging
const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const logData = {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString(),
  };

  console.log(`📝 ${logData.method} ${logData.path}`, logData);
  next();
};

const generateTransactionId = () => `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const simulateBigQueryInsert = async (transaction: PointsTransaction): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!config.isDevelopment) {
      console.log('🔧 En producción, esto insertaría en BigQuery:', {
        projectId: config.projectId,
        dataset: config.dataset,
        table: config.table,
        transaction,
      });
    }

    transactions.push(transaction);

    console.log('✅ Transacción registrada:', {
      transactionId: transaction.transactionId,
      userId: transaction.userId,
      points: transaction.points,
      environment: config.isDevelopment ? 'development' : 'production',
    });

    return true;
  } catch (error) {
    console.error('❌ Error registrando transacción:', error);
    return false;
  }
};

// Handler para registrar puntos
const registerPointsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, points } = req.body;

    if (!userId || typeof points !== 'number') {
      console.error('❌ Datos inválidos:', { userId, points });
      res.status(400).json({
        success: false,
        error: 'Datos inválidos. Se requiere userId y points numérico',
      });
      return;
    }

    const transaction: PointsTransaction = {
      userId,
      points,
      transactionId: generateTransactionId(),
      timestamp: new Date().toISOString(),
      status: 'success',
    };

    const insertSuccess = await simulateBigQueryInsert(transaction);

    if (!insertSuccess) {
      res.status(500).json({
        success: false,
        error: 'Error al registrar la transacción',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        points: transaction.points,
        timestamp: transaction.timestamp,
        environment: config.isDevelopment ? 'development' : 'production',
      },
    });
  } catch (error) {
    console.error('❌ Error en register-points:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};

// Handler para obtener transacciones
const getTransactionsHandler = (req: Request, res: Response): void => {
  if (!config.isDevelopment) {
    res.status(403).json({
      success: false,
      error: 'Endpoint solo disponible en desarrollo',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      transactions,
      environment: 'development',
      config: {
        projectId: config.projectId,
        dataset: config.dataset,
        table: config.table,
      },
    },
  });
};

// Configuración de rutas
const setupRoutes = (): void => {
  // Middleware de logging
  app.use(loggingMiddleware);

  // Ruta para registrar puntos
  app.post('/register-points', (req: Request, res: Response) => {
    void registerPointsHandler(req, res);
  });

  // Ruta para obtener transacciones
  app.get('/transactions', (req: Request, res: Response) => {
    void getTransactionsHandler(req, res);
  });
};

// Inicializar la aplicación
setupRoutes();

export const registerPoints = functions.https.onRequest(app);
