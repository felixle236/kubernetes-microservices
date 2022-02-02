export enum Environment {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    Production = 'production'
}

export enum LogProvider {
    Winston = 1,
    GoogleWinston = 2
}

export enum MailProvider {
    Console = 1,
    MailGun = 2
}

export enum SmsProvider {
    Console = 1,
    Twilio= 2
}

export enum NotificationProvider {
    Console = 1,
    NodePushNotification = 2
}
