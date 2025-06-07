import { Request, Response } from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import { PointsData } from '../types/points.types';
import { BIGQUERY_CONFIG, POINTS_SCHEMA } from '../config/bigquery.config';

export const registerPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, points, transactionId } = req.body as PointsData;

    if (!userId || !points || !transactionId) {
      res.status(400).json({
        error: 'Datos incompletos. Se requiere userId, points y transactionId',
      });
      return;
    }

    const rows = [
      {
        userId,
        points,
        transactionId,
        timestamp: new Date().toISOString(),
      },
    ];

    const bigquery = new BigQuery();
    const tableRef = bigquery.dataset(BIGQUERY_CONFIG.dataset).table(BIGQUERY_CONFIG.table);

    await tableRef.insert(rows, {
      schema: POINTS_SCHEMA,
      createInsertId: true,
      ignoreUnknownValues: false,
    });

    res.status(200).json({
      message: 'Puntos registrados correctamente',
      data: rows[0],
    });
  } catch (error) {
    console.error('Error al registrar puntos:', error);
    res.status(500).json({
      error: 'Error interno al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
