import { BIGQUERY_CONFIG, POINTS_SCHEMA } from '../../src/config/bigquery.config';

describe('BigQuery Configuration', () => {
  describe('BIGQUERY_CONFIG', () => {
    it('debería tener la configuración básica correcta', () => {
      expect(BIGQUERY_CONFIG).toEqual({
        dataset: 'points_system',
        table: 'points_transactions',
      });
    });
  });

  describe('POINTS_SCHEMA', () => {
    it('debería tener todos los campos requeridos', () => {
      expect(POINTS_SCHEMA.fields).toContainEqual({
        name: 'userId',
        type: 'STRING',
        mode: 'REQUIRED',
      });

      expect(POINTS_SCHEMA.fields).toContainEqual({
        name: 'points',
        type: 'INTEGER',
        mode: 'REQUIRED',
      });

      expect(POINTS_SCHEMA.fields).toContainEqual({
        name: 'transactionId',
        type: 'STRING',
        mode: 'REQUIRED',
      });

      expect(POINTS_SCHEMA.fields).toContainEqual({
        name: 'timestamp',
        type: 'TIMESTAMP',
        mode: 'REQUIRED',
      });
    });

    it('debería tener el número correcto de campos', () => {
      expect(POINTS_SCHEMA.fields).toHaveLength(4);
    });

    it('debería tener todos los campos como requeridos', () => {
      POINTS_SCHEMA.fields?.forEach(field => {
        expect(field.mode).toBe('REQUIRED');
      });
    });

    it('should have valid schema fields', () => {
      expect(POINTS_SCHEMA).toBeDefined();
      expect(POINTS_SCHEMA.fields).toBeDefined();
      expect(Array.isArray(POINTS_SCHEMA.fields)).toBe(true);

      POINTS_SCHEMA.fields?.forEach(field => {
        expect(field).toHaveProperty('name');
        expect(field).toHaveProperty('type');
        expect(field).toHaveProperty('mode');
      });
    });
  });
}); 