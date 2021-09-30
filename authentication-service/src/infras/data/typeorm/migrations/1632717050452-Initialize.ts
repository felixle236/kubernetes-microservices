import { Permission } from '@domain/entities/permission/Permission';
import { PermissionItemVO } from '@domain/entities/permission/PermissionItemVO';
import { HttpMethod } from '@domain/enums/permission/HttpMethod';
import { RoleId } from '@domain/enums/user/RoleId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionRepository } from '../repositories/permission/PermissionRepository';

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const permissionRepository = new PermissionRepository();

    let data = new Permission();
    data.path = '/api/v1/clients/my-profile';
    let item = new PermissionItemVO();
    item.method = HttpMethod.GET;
    item.isRequired = true;
    item.roleIds = [RoleId.Client];
    data.items = [item];
    await permissionRepository.create(data, queryRunner);

    data = new Permission();
    data.path = '/api/v1/clients/register';
    item = new PermissionItemVO();
    item.method = HttpMethod.POST;
    item.isRequired = false;
    item.roleIds = null;
    data.items = [item];
    await permissionRepository.create(data, queryRunner);

    data = new Permission();
    data.path = '/api/v1/clients/active';
    item = new PermissionItemVO();
    item.method = HttpMethod.POST;
    item.isRequired = false;
    item.roleIds = null;
    data.items = [item];
    await permissionRepository.create(data, queryRunner);

    data = new Permission();
    data.path = '/api/v1/clients/resend-activation';
    item = new PermissionItemVO();
    item.method = HttpMethod.POST;
    item.isRequired = false;
    item.roleIds = null;
    data.items = [item];
    await permissionRepository.create(data, queryRunner);

    data = new Permission();
    data.path = '/api/v1/clients';
    item = new PermissionItemVO();
    item.method = HttpMethod.POST;
    item.isRequired = true;
    item.roleIds = [RoleId.SuperAdmin];
    data.items = [item];
    await permissionRepository.create(data, queryRunner);

    data = new Permission();
    data.path = '/api/v1/clients/([0-9a-f-]{36})';
    item = new PermissionItemVO();
    item.method = HttpMethod.PUT;
    item.isRequired = true;
    item.roleIds = [RoleId.SuperAdmin];
    data.items = [item];
    await permissionRepository.create(data, queryRunner);
}

export class Initialize1632717050452 implements MigrationInterface {
    name = 'Initialize1632717050452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "auth_type_enum" AS ENUM(\'personal_email\', \'personal_phone\')');
        await queryRunner.query('CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "type" "auth_type_enum" NOT NULL, "username" character varying(120) NOT NULL, "password" character varying(32) NOT NULL, "forgot_key" character varying(64), "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_968b36cde50de085eb4cbb9486" ON "auth" ("username") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3" ON "auth" ("user_id", "type") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "path" character varying(250) NOT NULL, "items" json NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_3fab5567ee1fe830dfd2c307ce" ON "permission" ("path") ');
        await queryRunner.query('CREATE TYPE "users_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "email" character varying NOT NULL, "status" "users_status_enum" NOT NULL DEFAULT \'actived\', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');

        await initData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP INDEX "IDX_a2cecd1a3531c0b041e29ba46e"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "users_status_enum"');
        await queryRunner.query('DROP INDEX "IDX_3fab5567ee1fe830dfd2c307ce"');
        await queryRunner.query('DROP TABLE "permission"');
        await queryRunner.query('DROP INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3"');
        await queryRunner.query('DROP INDEX "IDX_968b36cde50de085eb4cbb9486"');
        await queryRunner.query('DROP TABLE "auth"');
        await queryRunner.query('DROP TYPE "auth_type_enum"');
    }
}
