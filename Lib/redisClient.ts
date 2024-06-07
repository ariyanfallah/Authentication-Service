import { REDIS_URI } from '../Configs/redisConfig';
import logger from '../Configs/logger';
import { Redis } from 'ioredis';


const redisCreateClient = (): Redis => {
    try {
        logger.info(`Connecting to Redis at ${REDIS_URI}`);

        const redisClient = new Redis(REDIS_URI || '');

        logger.info(redisClient);

        redisClient.on('error', (err) => logger.warn(`Failed to connect to Redis: ${err}`));

        redisClient.on('connect', () => logger.info('Connected to Redis...'));

        return redisClient;
    } catch (error) {
        logger.error(`Error in connecting to Redis: ${error}`);
        throw new Error('Error in connecting to Redis');
    }
}
export { redisCreateClient };