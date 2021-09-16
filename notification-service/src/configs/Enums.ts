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

export enum MailProvider {
    Console = 1,
    GoogleSmtp = 2,
    MailGun = 3
}

export enum SmsProvider {
    Console = 1,
    Twilio= 2
}

export enum NotificationProvider {
    Console = 1,
    NodePushNotification = 2
}
