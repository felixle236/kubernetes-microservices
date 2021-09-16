import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1631618345967 implements MigrationInterface {
    name = 'Initialize1631618345967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "chat_channel_user_status_enum" AS ENUM(\'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "chat_channel_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "channel_id" uuid NOT NULL, "status" "chat_channel_user_status_enum" NOT NULL DEFAULT \'actived\', CONSTRAINT "PK_f566534979d2c9a6cdf168e6112" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_553c924146f56a1ec4a4c8f12f" ON "chat_channel_user" ("user_id", "updated_at") ');
        await queryRunner.query('CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "channel_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "content" character varying(500) NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_3fc2d4699cb8572af0bd8dabfc" ON "chat" ("receiver_id") ');
        await queryRunner.query('CREATE INDEX "IDX_83520424a0c636e377ce19e826" ON "chat" ("channel_id", "created_at") ');
        await queryRunner.query('CREATE TABLE "chat_channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "last_message" character varying(500), "last_sender_id" uuid, CONSTRAINT "PK_175d69bf4830772f7ddd88f1fec" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TYPE "users_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "status" "users_status_enum" NOT NULL DEFAULT \'actived\', "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying NOT NULL, "avatar" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('ALTER TABLE "chat_channel_user" ADD CONSTRAINT "FK_e13ab498573cf0f5e078ab6a9de" FOREIGN KEY ("channel_id") REFERENCES "chat_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "chat" ADD CONSTRAINT "FK_175d69bf4830772f7ddd88f1fec" FOREIGN KEY ("channel_id") REFERENCES "chat_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "chat" DROP CONSTRAINT "FK_175d69bf4830772f7ddd88f1fec"');
        await queryRunner.query('ALTER TABLE "chat_channel_user" DROP CONSTRAINT "FK_e13ab498573cf0f5e078ab6a9de"');
        await queryRunner.query('DROP INDEX "IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "users_status_enum"');
        await queryRunner.query('DROP TABLE "chat_channel"');
        await queryRunner.query('DROP INDEX "IDX_83520424a0c636e377ce19e826"');
        await queryRunner.query('DROP INDEX "IDX_3fc2d4699cb8572af0bd8dabfc"');
        await queryRunner.query('DROP TABLE "chat"');
        await queryRunner.query('DROP INDEX "IDX_553c924146f56a1ec4a4c8f12f"');
        await queryRunner.query('DROP TABLE "chat_channel_user"');
        await queryRunner.query('DROP TYPE "chat_channel_user_status_enum"');
    }
}
