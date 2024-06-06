import { createClient } from 'redis';
import { REDIS_URI } from '../Configs/redisConfig';
import logger from '../Configs/logger';
import { Redis } from 'ioredis';


const redisCreateClient = () => {
    return new Redis(REDIS_URI)
}

// redisClient.on('error', (err) => logger.warn(`Failed to connect to Redis: ${err}`));

// (async () => {
//     await redisClient.connect();
//     redisClient.on('connect'  , () => logger.info('Connected to Redis...'));
// })();

// export default redisClient;
export { redisCreateClient };