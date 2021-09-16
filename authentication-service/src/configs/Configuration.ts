/* eslint-disable @typescript-eslint/naming-convention */
import { convertStringToBoolean } from '@utils/converter';
import dotenv from 'dotenv';
import { Environment, LogProvider } from './Enums';
dotenv.config();

// SYSTEM ENVIRONMENT

const keyEnv = Object.keys(Environment).find(key => Environment[key] === process.env.NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PRODUCT_NAME: string = process.env.PRODUCT_NAME ?? '';
export const PROTOTYPE: string = process.env.PROTOTYPE ?? '';
export const DOMAIN: string = process.env.DOMAIN ?? '';

// API SERVICE

export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT = Number(process.env.API_PORT);
export const API_PRIVATE_KEY: string = process.env.API_PRIVATE_KEY ?? '';

// PRIVATE SERVICES

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

// AUTHENTICATION SERVICE

export const AUTH_SIGNATURE: string = process.env.AUTH_SIGNATURE ?? '';
export const AUTH_SECRET_OR_PRIVATE_KEY: string = process.env.AUTH_SECRET_KEY ?? '';
export const AUTH_SECRET_OR_PUBLIC_KEY: string = process.env.AUTH_SECRET_KEY ?? '';

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.Winston;
