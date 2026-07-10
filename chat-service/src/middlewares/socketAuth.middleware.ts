import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

interface AuthSocket extends Socket {
    userId?: String;
    userName?: string;
}

export const socketAuthMiddleware = async (socket: AuthSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth?.token || (socket.handshake.query?.token as string);

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; name: string };

        const storedToken = await redisClient.get(`session:${decoded.id}`);

        if (!storedToken || storedToken !== token) {


            return next(new Error("Authentication error: Invalid or expired session"));
        }
        socket.userId = decoded.id;
        socket.userName = decoded.name;
        next();
    }
    catch (err) {
        console.log("Token verification failed.");
        next(new Error("Authentication error: Invalid token "));
    }
};
