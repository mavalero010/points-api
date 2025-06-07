import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Request as FirebaseRequest } from 'firebase-functions/lib/common/providers/https';
import { BigQuery } from '@google-cloud/bigquery';
import { registerPoints } from '..';
import * as functionsTest from 'firebase-functions-test';

const testEnv = functionsTest();

// Mock de BigQuery con una función insert que podemos controlar
const mockInsert = jest.fn();
jest.mock('@google-cloud/bigquery', () => ({
  BigQuery: jest.fn().mockImplementation(() => ({
    dataset: () => ({
      table: () => ({
        insert: mockInsert
      })
    })
  }))
}));

describe('registerPoints', () => {
  let mockReq: Partial<FirebaseRequest>;
  let mockRes: Partial<ExpressResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Configurar los mocks para cada prueba
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    
    mockReq = {
      body: {
        userId: 'test-user-id',
        points: 100,
        transactionId: 'test-transaction-id'
      },
      rawBody: Buffer.from(JSON.stringify({
        userId: 'test-user-id',
        points: 100,
        transactionId: 'test-transaction-id'
      }))
    };

    mockRes = {
      json: mockJson,
      status: mockStatus
    };

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it('should register points successfully', async () => {
    mockInsert.mockResolvedValueOnce([{}]);

    await registerPoints(mockReq as FirebaseRequest, mockRes as ExpressResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      message: 'Puntos registrados correctamente',
      data: expect.objectContaining({
        userId: 'test-user-id',
        points: 100,
        transactionId: 'test-transaction-id',
        timestamp: expect.any(String)
      })
    });
  });

  it('should return 400 for invalid data', async () => {
    mockReq.body = { userId: 'test-user-id' }; // Faltan points y transactionId
    mockReq.rawBody = Buffer.from(JSON.stringify({ userId: 'test-user-id' }));

    await registerPoints(mockReq as FirebaseRequest, mockRes as ExpressResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Datos incompletos',
      required: ['userId', 'points', 'transactionId']
    });
  });

  it('should handle BigQuery errors', async () => {
    const errorMessage = 'Error de BigQuery';
    mockInsert.mockRejectedValueOnce(new Error(errorMessage));

    await registerPoints(mockReq as FirebaseRequest, mockRes as ExpressResponse);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
      message: errorMessage
    });
  });
}); 