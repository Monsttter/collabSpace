import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRoutes from "./routes/auth.js";
import docRoutes from "./routes/docs.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join document room
  socket.on("join-doc", (docId) => {
    if (socket.lastRoom) {
        socket.leave(socket.lastRoom);
        socket.lastRoom = null;
    }
    socket.join(docId);
    socket.lastRoom = docId;
  });

  // Receive changes
  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT= 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});