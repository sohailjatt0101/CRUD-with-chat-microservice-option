import { Server, Socket } from "socket.io";
import Message from "../models/message.model";

interface AuthSocket extends Socket {
    userId?: string;
    userName?: string;
}

const onlineUsers = new Map<string, Set<string>>();

function markOnline(userId: string, socketId: string){
    if(!onlineUsers.has(userId)){
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socketId);
}

function markOffline(userId: string, socketId: string):boolean{
    const sockets= onlineUsers.get(userId);
    if(!sockets) return false;

    sockets.delete(socketId);
    if(sockets.size === 0){
        onlineUsers.delete(userId);
        return true;
    }
    return false;
}

export const registerChatHandlers = (io: Server) => {
    io.on("connection", (socket: AuthSocket) => {
        console.log(`User connected: ${socket.userId}`);

        if (socket.userId) {
            socket.join(socket.userId);
            const wasAlreadyOnline = onlineUsers.has(socket.userId);
            markOnline(socket.userId, socket.id);

            if(!wasAlreadyOnline){
                socket.broadcast.emit("user_status", {userId: socket.userId, online: true});
            }

            socket.emit("Online_users", Array.from(onlineUsers.keys()));
        }


        socket.on("send_message", async ({ receiverId, content }) => {
            if (!socket.userId) {
                socket.emit("error_message", "Unauthorized: missing user identity");
                return;
            }

            if (!socket.userName) { // Guard
                socket.emit("error_message", "Unauthorized: missing user name");
                return;
            }

            try {
                const message = await Message.create({
                    sender: socket.userId,
                    senderName: socket.userName, // now guaranteed to be `string`, not `string | undefined`
                    receiver: receiverId,
                    content,
                });
                io.to(receiverId).emit("receive_message", message);
                socket.emit("message_sent", message);
            } catch (err) {
                socket.emit("error_message", "Failed to send message");
            }
        });

        socket.on("typing", ({ receiverId }) => {
            io.to(receiverId).emit("user_typing", { senderId: socket.userId });
        });


        socket.on("check_status", (UserId:string) => {
            socket.emit("user_status", {UserId, online: onlineUsers.has(UserId)})
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userId}`);

            if (socket.userId) {
                const fullyOffline = markOffline(socket.userId, socket.id);
                if (fullyOffline) {
                    io.emit("user_status", { userId: socket.userId, online: false });
                }
            }
        });
    });
};