import 'infras/SingletonRegister';
import cluster from 'cluster';
import os from 'os';
import { ILogService } from 'application/interfaces/services/ILogService';
import { ENABLE_INTERNAL_API, ENABLE_RABBITMQ, ENABLE_SWAGGER_UI, ENABLE_WEB_API, ENVIRONMENT, INTERNAL_API_PORT, INTERNAL_API_URL, PROJECT_NAME, SWAGGER_UI_PORT, SWAGGER_UI_URL, WEB_API_PORT, WEB_API_URL } from 'config/Configuration';
import { ApiService as InternalApiService } from 'exposes/api/internal/ApiService';
import { ApiService as WebApiService } from 'exposes/api/web/ApiService';
import { ConsumerLoader } from 'exposes/queue/rabbitmq/ConsumerLoader';
import { ApiService as DocApiService } from 'exposes/ui/doc/ApiService';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { configureI18n } from 'shared/localization/Localization';
import { IRabbitMQContext } from 'shared/queue/rabbitmq/IRabbitMQContext';
import { Environment } from 'shared/types/Environment';
import { InjectDb, InjectQueue, InjectService } from 'shared/types/Injection';
import Container from 'typedi';

const logService = Container.get<ILogService>(InjectService.Log);
const dbContext = Container.get<IDbContext>(InjectDb.DbContext);
const redisContext = Container.get<IRedisContext>(InjectDb.RedisContext);
const rabbitMQContext = Container.get<IRabbitMQContext>(InjectQueue.RabbitMQContext);

const startApplication = async (): Promise<void> => {
    configureI18n(['en']);
    redisContext.createConnection();
    await dbContext.createConnection();

    if (ENABLE_RABBITMQ) {
        await rabbitMQContext.createConnection();
        await rabbitMQContext.createChannel();
        await ConsumerLoader.load();
    }

    if (ENABLE_WEB_API)
        WebApiService.init(WEB_API_PORT);

    if (ENABLE_INTERNAL_API)
        InternalApiService.init(INTERNAL_API_PORT);

    if (ENABLE_SWAGGER_UI)
        DocApiService.init(SWAGGER_UI_PORT);
};

const runMigrations = async (): Promise<void> => {
    logService.info('Run migrations...\n');
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        logService.info('Not found new migration.\n');
    migrations.forEach(migration => logService.info('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

const showServiceStatus = (): void => {
    if (ENABLE_WEB_API)
        logService.info(`Web API is ready \x1b[32m ${WEB_API_URL} \x1b[0m\n`);

    if (ENABLE_INTERNAL_API)
        logService.info(`Internal API is ready \x1b[32m ${INTERNAL_API_URL} \x1b[0m\n`);

    if (ENABLE_SWAGGER_UI)
        logService.info(`Swagger UI is ready \x1b[32m ${SWAGGER_UI_URL} \x1b[0m\n`);

    logService.info(`Project \x1b[1m\x1b[96m${PROJECT_NAME}\x1b[0m has started with \x1b[1m\x1b[32m${ENVIRONMENT}\x1b[0m environment...\n`);
};

if (ENVIRONMENT === Environment.Local) {
    logService.info(`Starting project \x1b[1m\x1b[96m${PROJECT_NAME}\x1b[0m with \x1b[1m\x1b[32m${ENVIRONMENT}\x1b[0m environment...\n`);

    startApplication().then(async () => {
        await runMigrations();
        showServiceStatus();
    });
}
else {
    if (cluster.isMaster || cluster.isPrimary) {
        logService.info('Starting project ' + PROJECT_NAME + ` with ${ENVIRONMENT} environment...`);
        showServiceStatus();

        const numCPUs = os.cpus().length;
        // Fork workers.
        for (let i = 0; i < numCPUs; i++)
            cluster.fork();

        cluster.on('exit', worker => {
            cluster.fork();
            logService.error(`Worker ${worker.process.pid} is died.`);
        });
        logService.info(`Master ${process.pid} is started.`);
    }
    else if (cluster.isWorker) {
        startApplication().then(() => {
            logService.info(`Worker ${process.pid} is started.`);
        }).catch((error: Error) => {
            logService.error(error.stack || error.message);
            dbContext.destroyConnection();
            setTimeout(() => process.exit(), 2000);
        });
    }
}
