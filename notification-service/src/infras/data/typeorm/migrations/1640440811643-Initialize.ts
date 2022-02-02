import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1640440811643 implements MigrationInterface {
    name = 'Initialize1640440811643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "notification_unread_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "notification_ids" uuid array NOT NULL, CONSTRAINT "PK_3e8f7631f4c7818ef6de6374f7c" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_5f26c896fc5bae06fe147cd867" ON "notification_unread_status" ("user_id") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "public"."users_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT \'actived\', "devices" jsonb, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "public"."notification_type_enum" AS ENUM(\'other\')');
        await queryRunner.query('CREATE TYPE "public"."notification_template_enum" AS ENUM(\'custom\', \'new_user_registration\')');
        await queryRunner.query('CREATE TYPE "public"."notification_target_enum" AS ENUM(\'all\', \'individual\', \'manager\', \'client\')');
        await queryRunner.query('CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" "public"."notification_type_enum" NOT NULL, "template" "public"."notification_template_enum" NOT NULL, "target" "public"."notification_target_enum" NOT NULL, "receiver_id" uuid, "title" character varying(40) NOT NULL, "content" character varying(80) NOT NULL, "content_spec" character varying(200) NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_8bdc07e9c41ce8d83730f0f5d8" ON "notification" ("created_at") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_8bdc07e9c41ce8d83730f0f5d8"');
        await queryRunner.query('DROP TABLE "notification"');
        await queryRunner.query('DROP TYPE "public"."notification_target_enum"');
        await queryRunner.query('DROP TYPE "public"."notification_template_enum"');
        await queryRunner.query('DROP TYPE "public"."notification_type_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "public"."users_status_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_5f26c896fc5bae06fe147cd867"');
        await queryRunner.query('DROP TABLE "notification_unread_status"');
    }
}
