import Task from "../models/task.model";
import redisClient from "../config/redis";
import logger from "../utils/logger";
const CACHE_TTL = 3600;

export const createTask = async (userId: string, data: any) => {
        const task = Task.create({ ...data, user: userId });
        await redisClient.del(`tasks: ${userId}`);
        return task;
};

export const getTasks = async (userId: string) =>{
        const cacheKey = `tasks:${userId}`;
        const cached = await redisClient.get(cacheKey);

        if (cached){
                logger.info("Serving tasks from cache");
                return JSON.parse(cached);
        }
        
        logger.info("serving tasks from DB");
        const tasks = await  Task.find({user : userId});
        await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(tasks));
        return tasks;
}

export const getTaskById = async (userId: string, id: string) => {
  const cacheKey = `task:${id}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    logger.info("Serving task from cache");
    return JSON.parse(cached);
  }

  const task = await Task.findOne({ _id: id, user: userId });
  if (task) {
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(task));
  }
  return task;
};

export const updateTask = async (userId: string, id: string, data: any) => {
  const task = await Task.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
  if (task) {
    await redisClient.del(`task:${id}`);      
    await redisClient.del(`tasks:${userId}`);  
  }
  return task;
};

export const deleteTask = async (userId: string, id: string) => {
  const task = await Task.findOneAndDelete({ _id: id, user: userId });
  if (task) {
    await redisClient.del(`task:${id}`);
    await redisClient.del(`tasks:${userId}`);
  }
  return task;
};


// Old without redis connected code 


// export const createTask = async (userId: string, data: any) => {
//         const task = Task.create({ ...data, user: userId });
//         return task;

// export const getTaskById = async (userId: string, id: string) =>{
//         Task.findOne({_id: id, user: userId});
// }

// export const updateTask = async (userId: string, id: string, data: any) =>{
//         Task.findOneAndUpdate({_id: id, user: userId}, data, {new: true});
// }
// export const deleteTask = async (userId: string, id: string) =>{
//         Task.findOneAndDelete({_id: id, user: userId});
// }
