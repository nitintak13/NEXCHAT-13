import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";
import { pub, sub } from "./lib/redis.js";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("sendMessage", (msg) => {
    const { receiverId } = msg;
    const socketId = userSocketMap[receiverId];
    if (socketId) {
      io.to(socketId).emit("newMessage", msg);
    }
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const initRedisSubscriber = async () => {
  try {
    await sub.subscribe("chat_channel");

    sub.on("message", (channel, raw) => {
      const payload = JSON.parse(raw);
      // console.log(" Received from Redis channel:", payload);

      if (payload.type === "newMessage") {
        const { newMessage, receiverId } = payload;
        const socketId = userSocketMap[receiverId];
        if (socketId) {
          io.to(socketId).emit("newMessage", newMessage);
        }
      }

      if (payload.type === "messageDeleted") {
        const { messageId, receiverId, senderId } = payload;

        const receiverSocket = userSocketMap[receiverId];
        const senderSocket = userSocketMap[senderId];

        if (receiverSocket)
          io.to(receiverSocket).emit("messageDeleted", { messageId });
        if (senderSocket)
          io.to(senderSocket).emit("messageDeleted", { messageId });
      }
    });
  } catch (err) {
    console.error(" Redis subscription setup failed:", err);
  }
};

await initRedisSubscriber();

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

export default server;
