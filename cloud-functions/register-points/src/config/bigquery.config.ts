import { TableSchema } from '@google-cloud/bigquery';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const BIGQUERY_CONFIG = {
  dataset: process.env.BIGQUERY_DATASET || 'points_system',
  table: process.env.BIGQUERY_TABLE || 'points_transactions',
};

export const POINTS_SCHEMA: TableSchema = {
  fields: [
    { name: 'userId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'points', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'transactionId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
  ],
}; 