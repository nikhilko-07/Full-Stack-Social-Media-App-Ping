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
    await mongoose.connect("mongodb+srv://nikhil:nikhil@ourdb.dykydkn.mongodb.net/?appName=ourDB");
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
    methods: ["GET", "POST"]
  }
});

// ================= SOCKET.IO LOGIC =================

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("Chat users not found");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user).emit("message received", newMessageRecieved, console.log(newMessageRecieved));
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// start server
server.listen(PORT, () => {
  db();
  console.log(`Server started on port ${PORT}`);
});
