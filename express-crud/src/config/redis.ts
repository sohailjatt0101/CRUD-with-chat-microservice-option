import Redis from "ioredis";
import logger from "../utils/logger";


const redisClient = new Redis({
   host: process.env.REDIS_HOST || "127.0.0.1",
   port: Number(process.env.REDIS_PORT || undefined),
});

redisClient.on("connect", () =>{
    logger.info(`Redis Connected`);
});

redisClient.on("error", (err) =>{
    logger.error(`Redis Cient Error, ${err}`);
});

export default redisClient;

