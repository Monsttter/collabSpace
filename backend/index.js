import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRoutes from "./routes/auth.js";
import docRoutes from "./routes/docs.js";
import http from "http";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

const PORT= 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});