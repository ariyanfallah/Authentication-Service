import { REDIS_URI } from '../Configs/redisConfig';
import logger from '../Configs/logger';
import { Redis } from 'ioredis';


const redisCreateClient = (): Redis => {
    try {
        logger.info(`Connecting to Redis at ${REDIS_URI}`);

        // let lastLoggedTime: any = new Date().getTime();

        const redisClient = new Redis(REDIS_URI || '');

        let lastLoggedAt = 0;

        function debounceLogger(err: any) {
        const currentTime = Date.now();
        lastLoggedAt = (lastLoggedAt > 0) ? lastLoggedAt : currentTime;
        const elapsedTime = (currentTime - lastLoggedAt);
        if (elapsedTime >= 5000) {
            logger.warn(`Failed to connect to Redis: ${err}`);
            lastLoggedAt = currentTime;
        }
        }

        redisClient.on('error', debounceLogger);


        redisClient.on('connect', () => logger.info('Connected to Redis...'));

        return redisClient;
    } catch (error) {
        logger.error(`Error in connecting to Redis: ${error}`);
        throw new Error('Error in connecting to Redis');
    }
}
export { redisCreateClient };