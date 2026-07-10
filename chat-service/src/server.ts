import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db";
import { socketAuthMiddleware } from "./middlewares/socketAuth.middleware";
import { registerChatHandlers } from "./sockets/chat.socket";
import { connect } from "mongoose";
import "./config/redis";


const app = express();
app.use(cors({origin: "*"}));

const httpServer = http.createServer(app);


const io = new Server(httpServer, {
    cors:{
        origin: "*",
        methods : ["GET", "POST"],
    },
});

io.use(socketAuthMiddleware);
registerChatHandlers(io);

const startServer = async() =>{
    await connectDB();

    const PORT = process.env.PORT || 6000;
    httpServer.listen(PORT, () =>console.log(`Chat service running on port ${PORT}`));
};

startServer();

