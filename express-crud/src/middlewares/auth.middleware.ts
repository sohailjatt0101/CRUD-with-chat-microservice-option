import {Request, Response} from "express";
import {verifyToken} from "../utils/jwt";
import redisClient from "../config/redis";


export interface AuthRequest extends Request{
    userId? : string;
}

export const authenticate = async (req : AuthRequest, res : Response, next : Function) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message : "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({ message: "No token provided" });
}

try {
  const decoded = verifyToken(token);

  const storedToken = await redisClient.get(`session: ${decoded.id}`);
  
  if (!storedToken || storedToken !== token) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
        req.userId = decoded.id;
        next();
    }
    catch(err){
        return res.status(401).json({message : "Invalid token"});
    }
};

