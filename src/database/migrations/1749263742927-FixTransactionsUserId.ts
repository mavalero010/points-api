import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTransactionsUserId1749263742927 implements MigrationInterface {
  name = 'FixTransactionsUserId1749263742927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Primero, verificar si hay registros con userId nulo
    const nullUsers = await queryRunner.query(`
            SELECT id FROM transactions WHERE userId IS NULL;
        `);

    // 2. Si hay registros con userId nulo, eliminarlos
    if (nullUsers && nullUsers.length > 0) {
      await queryRunner.query(`
                DELETE FROM transactions WHERE userId IS NULL;
            `);
    }

    // 3. Asegurarnos de que la columna userId existe y es del tipo correcto
    const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'transactions' 
                AND column_name = 'userId'
            );
        `);

    if (!columnExists[0].exists) {
      // Si la columna no existe, la creamos
      await queryRunner.query(`
                ALTER TABLE transactions 
                ADD COLUMN userId uuid NOT NULL;
            `);
    } else {
      // Si la columna existe, la modificamos para asegurar que es NOT NULL
      await queryRunner.query(`
                ALTER TABLE transactions 
                ALTER COLUMN userId SET NOT NULL,
                ALTER COLUMN userId TYPE uuid USING userId::uuid;
            `);
    }

    // 4. Asegurarnos de que existe la foreign key
    const fkExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.table_constraints 
                WHERE table_name = 'transactions' 
                AND constraint_name = 'FK_transactions_user'
            );
        `);

    if (!fkExists[0].exists) {
      await queryRunner.query(`
                ALTER TABLE transactions
                ADD CONSTRAINT FK_transactions_user
                FOREIGN KEY (userId)
                REFERENCES users(id)
                ON DELETE CASCADE;
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No podemos revertir esta migración de forma segura
    // ya que podría dejar la base de datos en un estado inconsistente
    await queryRunner.query(`
      -- Eliminar la foreign key si existe
      ALTER TABLE transactions 
      DROP CONSTRAINT IF EXISTS FK_transactions_user;
      
      -- Eliminar la columna userId
      ALTER TABLE transactions 
      DROP COLUMN IF EXISTS userId;
    `);
  }
}
