import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransactionRelations1749263742929 implements MigrationInterface {
  name = 'UpdateTransactionRelations1749263742929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Hacer backup de los datos existentes
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS transactions_backup AS 
            SELECT * FROM transactions;
        `);

    // 2. Eliminar la tabla transactions y sus dependencias
    await queryRunner.query(`
            DROP TABLE IF EXISTS transactions CASCADE;
        `);

    // 3. Crear la tabla transactions con la estructura correcta
    await queryRunner.query(`
            CREATE TABLE transactions (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                type "public"."transactions_type_enum" NOT NULL DEFAULT 'earn',
                points integer NOT NULL,
                date TIMESTAMP NOT NULL,
                description character varying,
                reference character varying,
                CONSTRAINT "PK_transactions" PRIMARY KEY (id),
                CONSTRAINT "FK_transactions_user" 
                    FOREIGN KEY ("userId") 
                    REFERENCES users(id) 
                    ON DELETE CASCADE
            );
        `);

    // 4. Crear índices
    await queryRunner.query(`
            CREATE INDEX "IDX_transactions_userId" ON transactions ("userId");
            CREATE INDEX "IDX_transactions_date" ON transactions (date);
        `);

    // 5. Restaurar los datos válidos
    await queryRunner.query(`
            INSERT INTO transactions (id, "userId", type, points, date, description, reference)
            SELECT 
                id,
                "userId",
                type,
                points,
                date,
                description,
                reference
            FROM transactions_backup
            WHERE "userId" IS NOT NULL 
            AND EXISTS (
                SELECT 1 FROM users 
                WHERE users.id = transactions_backup."userId"
            );
        `);

    // 6. Eliminar la tabla de backup
    await queryRunner.query(`
            DROP TABLE IF EXISTS transactions_backup;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Eliminar las foreign keys si existen
      ALTER TABLE transactions 
      DROP CONSTRAINT IF EXISTS FK_transactions_user;
      
      ALTER TABLE transactions 
      DROP CONSTRAINT IF EXISTS FK_transactions_reward;
    `);
  }
}
