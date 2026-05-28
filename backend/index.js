import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRoutes from "./routes/auth.js";
import docRoutes from "./routes/docs.js";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});