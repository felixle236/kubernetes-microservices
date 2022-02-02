/* eslint-disable @typescript-eslint/naming-convention */
import 'shared/types/Global';
import path from 'path';
import dotenv from 'dotenv';
import env from 'env-var';
import { Environment, LogProvider, StorageProvider } from 'shared/types/Environment';
dotenv.config();

// SYSTEM ENVIRONMENT
export const NODE_ENV = env.get('NODE_ENV').required().asString();
const keyEnv = Object.keys(Environment).find(key => Environment[key] === NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;
export const PROJECT_ID = env.get('PROJECT_ID').required().asString();
export const PROJECT_NAME = env.get('PROJECT_NAME').required().asString();
export const PROJECT_PROTOTYPE = env.get('PROJECT_PROTOTYPE').required().asString();
export const PROJECT_DOMAIN = env.get('PROJECT_DOMAIN').required().asString();
export const PROJECT_SUPPORT_NAME = env.get('PROJECT_SUPPORT_NAME').asString();
export const PROJECT_SUPPORT_EMAIL = env.get('PROJECT_SUPPORT_EMAIL').asString();

// WEB API

export const ENABLE_WEB_API = env.get('ENABLE_WEB_API').default(1).asBool();
export const WEB_API_PORT = env.get('WEB_API_PORT').required(ENABLE_WEB_API).asPortNumber();
export const WEB_API_URL = env.get('WEB_API_URL').required(ENABLE_WEB_API).asUrlString();
export const WEB_API_PRIVATE_KEY = env.get('WEB_API_PRIVATE_KEY').required(ENABLE_WEB_API).asString();

// INTERNAL API

export const ENABLE_INTERNAL_API = env.get('ENABLE_INTERNAL_API').default(1).asBool();
export const INTERNAL_API_PORT = env.get('INTERNAL_API_PORT').required(ENABLE_INTERNAL_API).asPortNumber();
export const INTERNAL_API_URL = env.get('INTERNAL_API_URL').required(ENABLE_INTERNAL_API).asUrlString();
export const INTERNAL_API_PRIVATE_KEY = env.get('INTERNAL_API_PRIVATE_KEY').required(ENABLE_INTERNAL_API).asString();

// SWAGGER UI

export const ENABLE_SWAGGER_UI = env.get('ENABLE_SWAGGER_UI').default(1).asBool();
export const SWAGGER_UI_PORT = env.get('SWAGGER_UI_PORT').required(ENABLE_SWAGGER_UI).asPortNumber();
export const SWAGGER_UI_URL = env.get('SWAGGER_UI_URL').required(ENABLE_SWAGGER_UI).asUrlString();
export const SWAGGER_UI_BASIC_USER = env.get('SWAGGER_UI_BASIC_USER').required(ENABLE_SWAGGER_UI).asString();
export const SWAGGER_UI_BASIC_PASS = env.get('SWAGGER_UI_BASIC_PASS').required(ENABLE_SWAGGER_UI).asString();
export const SWAGGER_UI_APIS = env.get('SWAGGER_UI_APIS').required(ENABLE_SWAGGER_UI).asArray();

// RABBITMQ CONFIGURATION

export const ENABLE_RABBITMQ = env.get('ENABLE_RABBITMQ').default(1).asBool();
export const RABBITMQ_HOST = env.get('RABBITMQ_HOST').required(ENABLE_RABBITMQ).asString();
export const RABBITMQ_USER = env.get('RABBITMQ_USER').required(ENABLE_RABBITMQ).asString();
export const RABBITMQ_PASS = env.get('RABBITMQ_PASS').required(ENABLE_RABBITMQ).asString();
export const RABBITMQ_PREFIX = env.get('RABBITMQ_PREFIX').required(ENABLE_RABBITMQ).asString();
export const RABBITMQ_EXCHANGE = env.get('RABBITMQ_EXCHANGE').required(ENABLE_RABBITMQ).asString();

// DATABASE CONFIGURATION

export const DB_TYPE = env.get('DB_TYPE').required().asString();
export const DB_HOST = env.get('DB_HOST').required().asString();
export const DB_PORT = env.get('DB_PORT').required().asPortNumber();
export const DB_NAME = env.get('DB_NAME').required().asString();
export const DB_USER = env.get('DB_USER').required().asString();
export const DB_PASS = env.get('DB_PASS').required().asString();

// DB CACHING CONFIGURATION

export const DB_CACHING_HOST = env.get('DB_CACHING_HOST').required().asString();
export const DB_CACHING_PORT = env.get('DB_CACHING_PORT').required().asPortNumber();
export const DB_CACHING_PASSWORD = env.get('DB_CACHING_PASSWORD').asString();
export const DB_CACHING_PREFIX = env.get('DB_CACHING_PREFIX').asString();

// AUTHENTICATION SERVICE LOCAL

export const AUTH_URL = env.get('AUTH_URL').required().asUrlString();
export const AUTH_INTERNAL_PRIVATE_KEY = env.get('AUTH_INTERNAL_PRIVATE_KEY').required().asString();

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = env.get('LOG_PROVIDER').default(LogProvider.Winston).asIntPositive();

// STORAGE SERVICE

export const STORAGE_PROVIDER: StorageProvider = env.get('STORAGE_PROVIDER').default(StorageProvider.Console).asIntPositive();
export const STORAGE_URL = env.get('STORAGE_URL').required().asUrlString();
export const STORAGE_UPLOAD_DIR = env.get('STORAGE_UPLOAD_DIR').default(path.join(__dirname, 'uploads')).asString();
export const STORAGE_BUCKET_NAME = env.get('STORAGE_BUCKET_NAME').required(STORAGE_PROVIDER !== StorageProvider.Console).asString();

const REQUIRED_GCP_CREDENTIAL = STORAGE_PROVIDER === StorageProvider.GoogleStorage;
export const GOOGLE_STORAGE_LOCATION = env.get('GOOGLE_STORAGE_LOCATION').required(REQUIRED_GCP_CREDENTIAL).asString();
export const GOOGLE_STORAGE_CLASS = env.get('GOOGLE_STORAGE_CLASS').required(REQUIRED_GCP_CREDENTIAL).asString();

// CLOUD CREDENTIALS

export const GOOGLE_APPLICATION_CREDENTIALS = env.get('GOOGLE_APPLICATION_CREDENTIALS').required(REQUIRED_GCP_CREDENTIAL).asString();
