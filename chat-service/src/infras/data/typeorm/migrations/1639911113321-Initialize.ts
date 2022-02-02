import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1639911113321 implements MigrationInterface {
    name = 'Initialize1639911113321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channel_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "content" character varying(500) NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_c816ad9866fbf631fe389dc799" ON "message" ("channel_id", "created_at") ');
        await queryRunner.query('CREATE TYPE "public"."users_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT \'actived\', "avatar" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TABLE "channel_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "channel_id" uuid NOT NULL, CONSTRAINT "PK_7e5d4007402f6c41e35003494f8" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a846c7202b4f59da68ad20af06" ON "channel_user" ("user_id") ');
        await queryRunner.query('CREATE INDEX "IDX_d31b165b69b0b23135ce413ce0" ON "channel_user" ("channel_id") ');
        await queryRunner.query('CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "last_message" character varying(500), "last_sender_id" uuid, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_f6d0a3bccef803efd6d5102655c" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "channel_user" ADD CONSTRAINT "FK_d31b165b69b0b23135ce413ce09" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "channel_user" DROP CONSTRAINT "FK_d31b165b69b0b23135ce413ce09"');
        await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_f6d0a3bccef803efd6d5102655c"');
        await queryRunner.query('DROP TABLE "channel"');
        await queryRunner.query('DROP INDEX "public"."IDX_d31b165b69b0b23135ce413ce0"');
        await queryRunner.query('DROP INDEX "public"."IDX_a846c7202b4f59da68ad20af06"');
        await queryRunner.query('DROP TABLE "channel_user"');
        await queryRunner.query('DROP INDEX "public"."IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "public"."users_status_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_c816ad9866fbf631fe389dc799"');
        await queryRunner.query('DROP TABLE "message"');
    }
}
