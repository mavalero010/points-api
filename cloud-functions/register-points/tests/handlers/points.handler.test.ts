import { Request, Response } from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import { registerPoints } from '../../src/handlers/points.handler';
import { BIGQUERY_CONFIG, POINTS_SCHEMA } from '../../src/config/bigquery.config';

// Mock de BigQuery
jest.mock('@google-cloud/bigquery');

describe('Points Handler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockInsert: jest.Mock;
  let bigqueryInstance: jest.Mocked<BigQuery>;
  let mockTable: jest.Mock;

  beforeEach(() => {
    // Configurar los mocks para cada prueba
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockInsert = jest.fn();
    mockTable = jest.fn().mockReturnValue({ insert: mockInsert });
    
    mockReq = {
      body: {
        userId: 'test-user-id',
        points: 100,
        transactionId: 'test-transaction-id'
      }
    };

    mockRes = {
      json: mockJson,
      status: mockStatus
    };

    // Configurar el mock de BigQuery
    bigqueryInstance = new BigQuery() as jest.Mocked<BigQuery>;
    (bigqueryInstance.dataset as jest.Mock) = jest.fn().mockReturnValue({
      table: mockTable
    });

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('registerPoints', () => {
    it('debería registrar puntos exitosamente', async () => {
      mockInsert.mockResolvedValueOnce([{}]);

      await registerPoints(mockReq as Request, mockRes as Response);

      // Verificar la respuesta HTTP
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Puntos registrados correctamente',
        data: expect.objectContaining({
          userId: 'test-user-id',
          points: 100,
          transactionId: 'test-transaction-id',
          timestamp: expect.any(String)
        })
      });

      // Verificar la llamada a BigQuery
      expect(bigqueryInstance.dataset).toHaveBeenCalledWith(BIGQUERY_CONFIG.dataset);
      expect(mockTable).toHaveBeenCalledWith(BIGQUERY_CONFIG.table);
      expect(mockInsert).toHaveBeenCalledWith(
        [{
          userId: 'test-user-id',
          points: 100,
          transactionId: 'test-transaction-id',
          timestamp: expect.any(String)
        }],
        {
          schema: POINTS_SCHEMA,
          createInsertId: true,
          ignoreUnknownValues: false,
        }
      );
    });

    it('debería retornar error 400 cuando faltan datos requeridos', async () => {
      const testCases = [
        { body: { points: 100, transactionId: 'test-id' }, missing: 'userId' },
        { body: { userId: 'test-id', transactionId: 'test-id' }, missing: 'points' },
        { body: { userId: 'test-id', points: 100 }, missing: 'transactionId' }
      ];

      for (const testCase of testCases) {
        mockReq.body = testCase.body;
        await registerPoints(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          error: 'Datos incompletos. Se requiere userId, points y transactionId'
        });
        expect(mockInsert).not.toHaveBeenCalled();

        jest.clearAllMocks();
      }
    });

    it('debería retornar error 500 cuando falla BigQuery en desarrollo', async () => {
      const errorMessage = 'Error de BigQuery';
      mockInsert.mockRejectedValueOnce(new Error(errorMessage));
      process.env.NODE_ENV = 'development';

      await registerPoints(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error interno al procesar la solicitud',
        details: errorMessage
      });
    });

    it('debería retornar error 500 sin detalles en producción', async () => {
      const errorMessage = 'Error de BigQuery';
      mockInsert.mockRejectedValueOnce(new Error(errorMessage));
      process.env.NODE_ENV = 'production';

      await registerPoints(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error interno al procesar la solicitud',
        details: undefined
      });
    });
  });
}); 