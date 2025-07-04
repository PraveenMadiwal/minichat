// src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"; // socket-attached Express app
import authRoutes from "./routes/auth.route.js"; 
import messageRoutes from "./routes/message.route.js"; 

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// API routes first
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Only serve static files **after** APIs
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB();
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
