import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import proyectRoutes from "./routes/proyectRoutes";
import cors from "cors";
import { corsConfig } from "./config/cors";
import authRoutes from "./routes/AuthRoute";

dotenv.config();

connectDB();
const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/proyects", proyectRoutes);

export default app;
