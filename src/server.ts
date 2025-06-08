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

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/proyects", proyectRoutes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "La ruta solicitada no existe",
  });
});

export default app;
