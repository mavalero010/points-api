/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions/v1';
import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
const envPath = path.resolve(__dirname, '../.env');
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
    NODE_ENV: process.env.NODE_ENV
  });
}

// Configuración del entorno
const config = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT ,
  credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/service-account-key.json',
  dataset: process.env.BIGQUERY_DATASET || 'points_system',
  table: process.env.BIGQUERY_TABLE || 'points_transactions',
  isDevelopment: process.env.NODE_ENV === 'development'
};

// Interfaz para la estructura de puntos
interface PointsTransaction {
  userId: string;
  points: number;
  transactionId: string;
  timestamp: string;
  status: 'success' | 'error';
}

// Simulación de almacenamiento en memoria (en producción sería BigQuery)
const transactions: PointsTransaction[] = [];

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req: Request, res: Response, next) => {
  console.log(`📝 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  });
  next();
});

// Función para generar ID de transacción
const generateTransactionId = () => `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Función para simular la inserción en BigQuery
const simulateBigQueryInsert = async (transaction: PointsTransaction): Promise<boolean> => {
  try {
    // Simulamos un pequeño delay como si fuera una operación real
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // En producción, aquí iría el código para insertar en BigQuery
    if (!config.isDevelopment) {
      console.log('🔧 En producción, esto insertaría en BigQuery:', {
        projectId: config.projectId,
        dataset: config.dataset,
        table: config.table,
        transaction
      });
    }
    
    // Por ahora, solo guardamos en memoria
    transactions.push(transaction);
    
    console.log('✅ Transacción registrada:', {
      transactionId: transaction.transactionId,
      userId: transaction.userId,
      points: transaction.points,
      environment: config.isDevelopment ? 'development' : 'production'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error registrando transacción:', error);
    return false;
  }
};

// Endpoint principal para registrar puntos
app.post('/register-points', async (req: Request, res: Response) => {
  try {
    const { userId, points } = req.body;

    // Validaciones básicas
    if (!userId || typeof points !== 'number') {
      console.error('❌ Datos inválidos:', { userId, points });
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos. Se requiere userId y points numérico'
      });
    }

    // Crear objeto de transacción
    const transaction: PointsTransaction = {
      userId,
      points,
      transactionId: generateTransactionId(),
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    // Simular inserción en BigQuery
    const insertSuccess = await simulateBigQueryInsert(transaction);

    if (!insertSuccess) {
      return res.status(500).json({
        success: false,
        error: 'Error al registrar la transacción'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      data: {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        points: transaction.points,
        timestamp: transaction.timestamp,
        environment: config.isDevelopment ? 'development' : 'production'
      }
    });

  } catch (error) {
    console.error('❌ Error en register-points:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint de prueba para verificar transacciones (solo para desarrollo)
app.get('/transactions', (req: Request, res: Response) => {
  if (!config.isDevelopment) {
    return res.status(403).json({
      success: false,
      error: 'Endpoint solo disponible en desarrollo'
    });
  }
  
  return res.status(200).json({
    success: true,
    data: {
      transactions,
      environment: 'development',
      config: {
        projectId: config.projectId,
        dataset: config.dataset,
        table: config.table
      }
    }
  });
});

// Exportar la función HTTP
export const registerPoints = functions.https.onRequest(app);
