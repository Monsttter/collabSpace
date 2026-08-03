import express from "express";
import cors from "cors";
import 'dotenv/config';
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import http from "http";
import errorMiddleware from "./middleware/errorMiddleware.js";
import pool from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

const server = http.createServer(app);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/documents", shareRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});