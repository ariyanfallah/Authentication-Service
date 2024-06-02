"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const winstonParams = {
    defaultLevel: process.env.LOG_LEVEL || 'info',
    defaultFormat: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.colorize()),
    rootDir: process.env.LOG_DIR || './log'
};
const logger = (level, rootDir, serviceName) => winston.createLogger({
    defaultMeta: { service: serviceName !== null && serviceName !== void 0 ? serviceName : 'notification-service' },
    level: level !== null && level !== void 0 ? level : winstonParams.defaultLevel,
    format: winstonParams.defaultFormat,
    transports: [
        new winston.transports.Console({
            level: level !== null && level !== void 0 ? level : winstonParams.defaultLevel,
            format: winston.format.combine(winston.format.simple(), winston.format.colorize())
        }),
        new winston.transports.File({ filename: `${rootDir !== null && rootDir !== void 0 ? rootDir : winstonParams.rootDir}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${rootDir !== null && rootDir !== void 0 ? rootDir : winstonParams.rootDir}/combined.log` })
    ]
});
exports.default = logger;
