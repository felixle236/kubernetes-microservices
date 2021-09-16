export enum Environment {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    Production = 'production'
}

export enum LogProvider {
    Winston = 1,
    AwsWinston = 2,
    GoogleWinston = 3
}

export enum StorageProvider {
    Console = 1,
    MinIO = 2,
    GoogleStorage = 3
}
