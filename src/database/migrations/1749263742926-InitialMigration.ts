import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1749263742926 implements MigrationInterface {
  name = 'InitialMigration1749263742926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si el tipo enum existe antes de crearlo
    const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'transactions_type_enum'
            );
        `);

    if (!enumExists[0].exists) {
      await queryRunner.query(`
                CREATE TYPE "public"."transactions_type_enum" AS ENUM('earn', 'redeem')
            `);
    }

    // Verificar si las tablas existen antes de crearlas
    const usersExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

    if (!usersExists[0].exists) {
      await queryRunner.query(`
                CREATE TABLE "users" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "name" character varying NOT NULL,
                    "totalPoints" integer NOT NULL DEFAULT 0,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_users" PRIMARY KEY ("id")
                )
            `);
    }

    const transactionsExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'transactions'
            );
        `);

    if (!transactionsExists[0].exists) {
      await queryRunner.query(`
                CREATE TABLE "transactions" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "userId" uuid NOT NULL,
                    "type" "public"."transactions_type_enum" NOT NULL DEFAULT 'earn',
                    "points" integer NOT NULL,
                    "date" TIMESTAMP NOT NULL,
                    "description" character varying,
                    "reference" character varying,
                    CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
                    CONSTRAINT "FK_transactions_user" FOREIGN KEY ("userId") 
                        REFERENCES "users"("id") ON DELETE CASCADE
                )
            `);
    }

    const rewardsExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'rewards'
            );
        `);

    if (!rewardsExists[0].exists) {
      await queryRunner.query(`
                CREATE TABLE "rewards" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "name" character varying NOT NULL,
                    "description" text,
                    "pointsCost" integer NOT NULL,
                    "isActive" boolean NOT NULL DEFAULT true,
                    "stock" integer,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_rewards" PRIMARY KEY ("id")
                )
            `);
    }

    // Crear índices solo si no existen
    const indices = [
      { name: 'IDX_transactions_userId', table: 'transactions', column: 'userId' },
      { name: 'IDX_transactions_date', table: 'transactions', column: 'date' },
      { name: 'IDX_rewards_isActive', table: 'rewards', column: 'isActive' },
    ];

    for (const index of indices) {
      const indexExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE indexname = '${index.name}'
                );
            `);

      if (!indexExists[0].exists) {
        await queryRunner.query(`
                    CREATE INDEX "${index.name}" ON "${index.table}" ("${index.column}")
                `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_rewards_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_transactions_date"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_transactions_userId"`);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE IF EXISTS "rewards"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Eliminar enum solo si no hay tablas que lo usen
    const enumInUse = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_depend d
                JOIN pg_type t ON t.oid = d.refobjid
                WHERE t.typname = 'transactions_type_enum'
                AND d.refclassid = 'pg_type'::regclass
                AND d.classid = 'pg_class'::regclass
            );
        `);

    if (!enumInUse[0].exists) {
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."transactions_type_enum"`);
    }
  }
}
