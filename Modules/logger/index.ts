import winston from 'winston';

const winstonParams = {
    defaultLevel: process.env.LOG_LEVEL || 'info',
    defaultFormat: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize()
    ),
    rootDir: process.env.LOG_DIR || './log'
}

const logger = (level?: string, rootDir?: string, serviceName?: string) => winston.createLogger({
    defaultMeta: { service: serviceName ?? 'notification-service' },
    level: level ?? winstonParams.defaultLevel,
    format: winstonParams.defaultFormat,
    transports: [
        new winston.transports.Console({
            level: level ?? winstonParams.defaultLevel,
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize()
            )
        }),
        new winston.transports.File({ filename: `${rootDir ?? winstonParams.rootDir}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${rootDir ?? winstonParams.rootDir}/combined.log`})
    ]
})

export default logger;