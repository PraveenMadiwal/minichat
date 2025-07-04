import {Server, Socket} from "socket.io";
import http from "http";
import express from "express";


const app =express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
//used tp store online users
const userSocketMap = {}; //{userID: socketId}

io.on("connection", (socket) =>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all connected clients
    io.emit("setOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", () =>{
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("setOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io, app, server}