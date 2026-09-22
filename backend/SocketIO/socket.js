// socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Mapping userId to their socket.id
const userSocketMap = {};

// Utility: get socket.id by userId
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Handle socket connections
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;

        // Notify all users about online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Send message instantly
    socket.on("sendMessage", ({ receiverId, newMessage }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    });

    // On disconnect: cleanup
    socket.on("disconnect", () => {
        for (const [uid, sid] of Object.entries(userSocketMap)) {
            if (sid === socket.id) {
                delete userSocketMap[uid];
                break;
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
