// export const redisConfig = {
//     host: process.env.REDIS_HOST || "localhost",
//     port: process.env.REDIS_PORT || 6379,
//     // ttl: process.env.REDIS_TTL || 60000
// }

const REDIS_CONFIG = {
    PROTOCOL: process.env.WHITELIST_PROTOCOL || 'redis',
    HOST: process.env.WHITELIST_HOST || 'redis',
    PORT: process.env.WHITELIST_PORT || '6379',
    DB: process.env.WHITELIST_DB || '1',
    USER: process.env.WHITELIST_USERNAME || 'guest',
    PASSWORD: process.env.WHITELIST_PASSWORD || 'guest',
}
// redis://redis:6379
// export const REDIS_URI = `${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}`
// export const REDIS_URI = `${REDIS_CONFIG.PROTOCOL}://${REDIS_CONFIG.USER}:${REDIS_CONFIG.PASSWORD}@${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}/${REDIS_CONFIG.DB}`
export const REDIS_URI= `${REDIS_CONFIG.PROTOCOL}://${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}`
export default REDIS_CONFIG;