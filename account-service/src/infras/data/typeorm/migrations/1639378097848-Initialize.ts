import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/Manager';
import { GenderType } from 'domain/enums/GenderType';
import { ManagerStatus } from 'domain/enums/ManagerStatus';
import { RoleId } from 'domain/enums/RoleId';
import { IManagerRepository } from 'application/interfaces/repositories/IManagerRepository';
import { AuthenticationService } from 'infras/services/authentication/AuthenticationService';
import { LogService } from 'infras/services/log/LogService';
import { RabbitMQContext } from 'infras/services/queue/rabbitmq/RabbitMQContext';
import { RabbitMQService } from 'infras/services/queue/rabbitmq/RabbitMQService';
import { ErrorCode } from 'shared/exceptions/message/ErrorCode';
import { TraceRequest } from 'shared/request/TraceRequest';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ManagerRepository } from '../repositories/ManagerRepository';

const logService = new LogService();
const rabbitMQContext = new RabbitMQContext(logService);
const authenticationService = new AuthenticationService(logService);

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const managerRepository: IManagerRepository = new ManagerRepository();

    // Create user "Super Admin"

    const manager = new Manager();
    manager.id = randomUUID();
    manager.roleId = RoleId.SuperAdmin;
    manager.status = ManagerStatus.Actived;
    manager.firstName = 'Super';
    manager.lastName = 'Admin';
    manager.email = 'admin@localhost.com';
    manager.gender = GenderType.Male;

    const usecaseOption = new UsecaseOption();
    usecaseOption.trace = new TraceRequest();
    usecaseOption.trace.id = randomUUID();

    await managerRepository.create(manager, queryRunner);
    await authenticationService.createUserAuth({
        userId: manager.id,
        email: manager.email,
        password: 'Nodecore@2'
    }, usecaseOption).catch(error => {
        if (error.code !== ErrorCode.DATA_EXISTED)
            throw error;
    });

    await rabbitMQContext.createConnection();
    await rabbitMQContext.createChannel();

    const rabbitMQService = new RabbitMQService(rabbitMQContext);
    rabbitMQService.publishAccountEventUserCreated({
        id: manager.id,
        roleId: manager.roleId,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        status: manager.status
    }, usecaseOption);

    logService.info('\x1b[32m Create user "Super Admin" successfully. \x1b[0m');
}

export class Initialize1639378097848 implements MigrationInterface {
    name = 'Initialize1639378097848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "avatar" character varying, "gender" character varying, "birthday" date, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") ');
        await queryRunner.query('CREATE TYPE "public"."client_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "client" ("email" character varying NOT NULL, "phone" character varying, "address" json, "locale" character varying, "status" "public"."client_status_enum" NOT NULL DEFAULT \'actived\', "active_key" character varying, "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id")) INHERITS ("users")');
        await queryRunner.query('CREATE INDEX "IDX_ea545365f74ddd2a7ed1fd4263" ON "client" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_6376cac90cf2c7378f369a271c" ON "client" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "public"."manager_status_enum" AS ENUM(\'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "manager" ("email" character varying NOT NULL, "status" "public"."manager_status_enum" NOT NULL DEFAULT \'actived\', "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b3ac840005ee4ed76a7f1c51d01" PRIMARY KEY ("id")) INHERITS ("users")');
        await queryRunner.query('CREATE INDEX "IDX_67b47d76acd361b2f702095190" ON "manager" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_c94753b4da020c90870ab40b7a" ON "manager" ("email") WHERE deleted_at IS NULL');

        await initData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."IDX_c94753b4da020c90870ab40b7a"');
        await queryRunner.query('DROP INDEX "public"."IDX_67b47d76acd361b2f702095190"');
        await queryRunner.query('DROP TABLE "manager"');
        await queryRunner.query('DROP TYPE "public"."manager_status_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_6376cac90cf2c7378f369a271c"');
        await queryRunner.query('DROP INDEX "public"."IDX_ea545365f74ddd2a7ed1fd4263"');
        await queryRunner.query('DROP TABLE "client"');
        await queryRunner.query('DROP TYPE "public"."client_status_enum"');
        await queryRunner.query('DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"');
        await queryRunner.query('DROP TABLE "users"');
    }
}
