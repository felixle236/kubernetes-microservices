/* eslint-disable @typescript-eslint/naming-convention */
import { convertStringToBoolean } from '@utils/converter';
import { Environment, LogProvider } from './Enums';

// SYSTEM ENVIRONMENT

const keyEnv = Object.keys(Environment).find(key => Environment[key] === process.env.NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;
let env = '';
switch (ENVIRONMENT) {
case Environment.Development:
    env = 'dev';
    break;
case Environment.Staging:
    env = 'stag';
    break;
case Environment.Production:
    env = 'prod';
    break;
default:
    env = 'local';
    break;
}
export const ENV = env;

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PRODUCT_NAME: string = process.env.PRODUCT_NAME ?? '';

// API SERVICE

export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT = Number(process.env.API_PORT);
export const API_PRIVATE_KEY: string = process.env.API_PRIVATE_KEY ?? '';

// SOCKET SERVICE

export const ENABLE_SOCKET_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_SOCKET_SERVICE);
export const SOCKET_PORT = Number(process.env.SOCKET_PORT);

// PRIVATE SERVICES

export const AUTH_URL: string = process.env.AUTH_URL ?? '';
export const AUTH_PRIVATE_KEY: string = process.env.AUTH_PRIVATE_KEY ?? '';

// RABBITMQ CONFIGURATION

export const ENABLE_RABBITMQ: boolean = convertStringToBoolean(process.env.ENABLE_RABBITMQ);
export const RABBITMQ_HOST: string = process.env.RABBITMQ_HOST ?? '';
export const RABBITMQ_USER: string = process.env.RABBITMQ_USER ?? '';
export const RABBITMQ_PASS: string = process.env.RABBITMQ_PASS ?? '';

// CLOUD CREDENTIALS

export const AWS_REGION: string = process.env.AWS_REGION ?? '';
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY ?? '';
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY ?? '';

export const GOOGLE_APPLICATION_CREDENTIALS: string = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '';

// DATABASE CONFIGURATION

export const DB_TYPE: string = process.env.DB_TYPE ?? '';
export const DB_HOST: string = process.env.DB_HOST ?? '';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 0;
export const DB_NAME: string = process.env.DB_NAME ?? '';
export const DB_USER: string = process.env.DB_USER ?? '';
export const DB_PASS: string = process.env.DB_PASS ?? '';

// DB CACHING CONFIGURATION

export const DB_CACHING_HOST: string = process.env.DB_CACHING_HOST ?? '';
export const DB_CACHING_PORT: number = process.env.DB_CACHING_PORT ? Number(process.env.DB_CACHING_PORT) : 0;
export const DB_CACHING_PASSWORD: string | undefined = process.env.DB_CACHING_PASSWORD || undefined;
export const DB_CACHING_PREFIX: string | undefined = process.env.DB_CACHING_PREFIX || undefined;

// DB SOCKET CONFIGURATION

export const DB_SOCKET_HOST: string = process.env.DB_SOCKET_HOST ?? '';
export const DB_SOCKET_PORT: number = process.env.DB_SOCKET_PORT ? Number(process.env.DB_SOCKET_PORT) : 0;
export const DB_SOCKET_PASSWORD: string | undefined = process.env.DB_SOCKET_PASSWORD || undefined;
export const DB_SOCKET_PREFIX: string | undefined = process.env.DB_SOCKET_PREFIX || undefined;

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.Winston;
