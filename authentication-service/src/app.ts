import './infras/AliasRegister';
import './infras/SingletonRegister';
import cluster from 'cluster';
import os from 'os';
import { API_PORT, ENABLE_API_SERVICE, ENABLE_RABBITMQ, ENVIRONMENT, PROJECT_NAME } from '@configs/Configuration';
import { Environment } from '@configs/Enums';
import { ILogService } from '@gateways/services/ILogService';
import { ApiService } from '@infras/api/ApiService';
import { QueueService } from '@infras/queue/QueueService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { Container } from 'typedi';

const logService = Container.get<ILogService>('log.service');
const dbContext = Container.get<IDbContext>('db.context');
const redisContext = Container.get<IRedisContext>('redis.context');

const startApplication = async (): Promise<void> => {
    redisContext.createConnection();
    await dbContext.createConnection();

    if (ENABLE_RABBITMQ)
        await QueueService.init();

    if (ENABLE_API_SERVICE)
        ApiService.init(API_PORT);
};

const runMigrations = async (): Promise<void> => {
    logService.info('Run migrations...');
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        logService.info('Not found new migration.');
    migrations.forEach(migration => logService.info('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

const showServiceStatus = (): void => {
    if (ENABLE_API_SERVICE)
        logService.info(`Api service is ready \x1b[32m http://localhost:${API_PORT} \x1b[0m`);
};

if (ENVIRONMENT === Environment.Local) {
    logService.info('Starting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m with \x1b[32mdevelopment\x1b[0m mode...');

    startApplication().then(async () => {
        await runMigrations();
        showServiceStatus();
    });
}
else {
    if (cluster.isMaster) {
        logService.info('Starting project ' + PROJECT_NAME + '...');
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
