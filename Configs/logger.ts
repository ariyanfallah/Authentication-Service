import appLogger from '../Modules/logger';

const logger = appLogger(process.env.LOG_LEVEL , process.env.LOG_DIR, 'Authentication');

export default logger;