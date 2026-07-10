import redis from "ioredis";

const redisClient = new redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
});

redisClient.on("connect", () => console.log("Chat service connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));   

export default redisClient;

