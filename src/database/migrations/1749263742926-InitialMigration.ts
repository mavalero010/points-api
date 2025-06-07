import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749263742926 implements MigrationInterface {
    name = 'InitialMigration1749263742926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear enum para tipo de transacción
        await queryRunner.query(`
            CREATE TYPE "public"."transactions_type_enum" AS ENUM('earn', 'redeem')
        `);

        // Crear tabla de usuarios
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

        // Crear tabla de transacciones
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

        // Crear tabla de recompensas
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

        // Crear índices
        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_userId" ON "transactions" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_date" ON "transactions" ("date")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_rewards_isActive" ON "rewards" ("isActive")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índices
        await queryRunner.query(`DROP INDEX "public"."IDX_rewards_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_date"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_userId"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE "rewards"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Eliminar enum
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }
}
