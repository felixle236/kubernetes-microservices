import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1640708717745 implements MigrationInterface {
    name = 'Initialize1640708717745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."users_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT \'actived\', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "public"."auth_type_enum" AS ENUM(\'personal_email\', \'personal_phone\')');
        await queryRunner.query('CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "type" "public"."auth_type_enum" NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "forgot_key" character varying, "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_968b36cde50de085eb4cbb9486" ON "auth" ("username") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3" ON "auth" ("user_id", "type") WHERE deleted_at IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_4f6bf4f0ab35e68dfe3bc087e3"');
        await queryRunner.query('DROP INDEX "public"."IDX_968b36cde50de085eb4cbb9486"');
        await queryRunner.query('DROP TABLE "auth"');
        await queryRunner.query('DROP TYPE "public"."auth_type_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "public"."users_status_enum"');
    }
}
