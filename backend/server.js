import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
import storyRoutes from "./routes/story.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use(userRoutes);
app.use(postRoutes);
app.use(storyRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

// DB connection
const db = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhil:nikhil@ourdb.dykydkn.mongodb.net/?appName=ourDB",
    );
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

// 🔹 create HTTP server
const server = http.createServer(app);

// 🔹 attach socket.io to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // frontend URL in prod
    methods: ["GET", "POST"],
  },
});

// ================= SOCKET.IO LOGIC =================

io.on("connection", (socket) => {
  // user personal room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.to(chatId).emit("stop typing");
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

    if (!chat?.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) {
        return
      };
      // send to user room
      socket.to(user._id).emit("message received", newMessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// start server
server.listen(PORT, () => {
  db();
  console.log(`Server started on port ${PORT}`);
});
