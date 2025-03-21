import { createClient } from 'redis';

export const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15899.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com',
        port: 15899
    }
})
await redisClient.connect()
redisClient.on('error', err => console.log('Redis Client Erorr', err))
