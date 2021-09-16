import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1631523809356 implements MigrationInterface {
    name = 'Initialize1631523809356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "notification_type_enum" AS ENUM(\'other\')');
        await queryRunner.query('CREATE TYPE "notification_target_enum" AS ENUM(\'all\', \'individual\', \'manager\', \'client\')');
        await queryRunner.query('CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" "notification_type_enum" NOT NULL, "target" "notification_target_enum" NOT NULL, "receiver_id" uuid, "is_read" boolean NOT NULL DEFAULT false, "title" character varying(60), "content" character varying(250) NOT NULL, "content_html" character varying(1000) NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_1d66806441d2da3091e6f0d4bc" ON "notification" ("receiver_id", "created_at") ');
        await queryRunner.query('CREATE INDEX "IDX_8bdc07e9c41ce8d83730f0f5d8" ON "notification" ("created_at") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_8bdc07e9c41ce8d83730f0f5d8"');
        await queryRunner.query('DROP INDEX "IDX_1d66806441d2da3091e6f0d4bc"');
        await queryRunner.query('DROP TABLE "notification"');
        await queryRunner.query('DROP TYPE "notification_target_enum"');
        await queryRunner.query('DROP TYPE "notification_type_enum"');
    }
}
