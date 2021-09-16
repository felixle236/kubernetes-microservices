/* eslint-disable @typescript-eslint/naming-convention */
import { convertStringToBoolean } from '@utils/converter';
import dotenv from 'dotenv';
import { Environment, LogProvider, StorageProvider } from './Enums';
dotenv.config();

// SYSTEM ENVIRONMENT

const keyEnv = Object.keys(Environment).find(key => Environment[key] === process.env.NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PRODUCT_NAME: string = process.env.PRODUCT_NAME ?? '';

// API SERVICE

export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT = Number(process.env.API_PORT);
export const API_PRIVATE_KEY: string = process.env.API_PRIVATE_KEY ?? '';

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

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.Winston;

// STORAGE SERVICE

export const STORAGE_PROVIDER: StorageProvider = process.env.STORAGE_PROVIDER ? Number(process.env.STORAGE_PROVIDER) : StorageProvider.Console;
export const STORAGE_URL: string = process.env.STORAGE_URL ?? 'http://localhost';
export const STORAGE_UPLOAD_DIR: string = process.env.STORAGE_UPLOAD_DIR ?? 'uploads';
export const STORAGE_BUCKET_NAME: string = process.env.STORAGE_BUCKET_NAME ?? '';

export const MINIO_HOST: string = process.env.MINIO_HOST ?? '';
export const MINIO_PORT: number = process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 0;
export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY ?? '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY ?? '';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MINIO_USE_SSL: boolean = convertStringToBoolean(process.env.MINIO_USE_SSL);

export const GOOGLE_STORAGE_LOCATION: string = process.env.GOOGLE_STORAGE_LOCATION ?? '';
export const GOOGLE_STORAGE_CLASS: string = process.env.GOOGLE_STORAGE_CLASS ?? '';
