import type { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Lista de dominios permitidos
    const whitelist = [
      process.env.FRONTEND_URL,
      "https://upstack-front.vercel.app", // URL de producción
    ].filter(Boolean); // Elimina valores undefined o null

    // En desarrollo, origin puede ser undefined cuando las peticiones son del mismo origen
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origen bloqueado por CORS:", origin);
      console.log("Orígenes permitidos:", whitelist);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true, // Permite credenciales
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
