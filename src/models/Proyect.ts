import { Schema, Document, model } from "mongoose";
import type { ITask } from "./Task";
import type { IUser } from "./User";

// --- 1. Definición del Tipo TypeScript (La Etiqueta/Descripción) ---
// Definimos cómo TypeScript debe "ver" un objeto Proyecto en nuestro código.
// Es solo una descripción para el editor y el compilador.
export interface ProyectType extends Document {
  // Le añadimos "& Document" para que TypeScript SEPA que los objetos REALES
  // que Mongoose nos dará LUEGO, tendrán MÁS cosas (métodos como .save(), .deleteOne()
  // y propiedades como _id) que Mongoose "inyecta" en tiempo de ejecución.
  // ¡Ojo! Esto SOLO DESCRIBE, no implementa nada aquí.
  proyectName: string;
  clientName: string;
  description: string;
  tasks: ITask[];
  manager: IUser;
  team: IUser[];
}

// --- 2. Definición del Esquema (Schema - El Plano Detallado) ---
// El Schema es como el "CREATE TABLE" de SQL, pero con SUPERPODERES.
// Define la ESTRUCTURA (campos y sus tipos básicos) que Mongoose espera
// para los documentos DENTRO de la colección "proyects".
// PERO TAMBIÉN define reglas y transformaciones que Mongoose aplicará
// en nuestra *aplicación* ANTES de guardar en MongoDB (validaciones, trim, etc.).
// Es el "contrato" a nivel de aplicación.
const proyectSchema = new Schema<ProyectType>( // Usamos <ProyectType> para CONECTAR este Schema con nuestro Tipo TS.
  {
    // Aquí definimos explícitamente los campos que mencionamos en ProyectType.
    proyectName: {
      type: String, // Tipo de dato básico (como en SQL)
      required: true, // Regla de Mongoose: no guardar si falta.
      trim: true, // Regla de Mongoose: quitar espacios antes de guardar.
    },
    clientName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  }
  // Aquí podrían ir más opciones del Schema, como { timestamps: true }
);

// --- 3. Creación del Modelo (Model - La Constructora/Interfaz Principal) ---
// El Modelo se crea A PARTIR del Schema (el plano).
// NO es un documento individual, sino el OBJETO PRINCIPAL que usamos para
// HABLAR con TODA la colección "proyects" en la base de datos MongoDB.
// Nos da los métodos para CRUD: .find(), .create(), .findByIdAndUpdate(), .deleteOne(), etc.
// Mongoose usa el nombre "Proyect" para saber que debe operar sobre la colección "proyects".
const Proyect = model<ProyectType>( // <ProyectType> aquí asegura que Mongoose trate los docs como nuestro tipo TS.
  "Proyect", // Nombre del Modelo (usado para la colección 'proyects')
  proyectSchema // El plano que usará este Modelo.
);

// --- 4. Exportación ---
// Exportamos el Modelo (`Proyect`) para poder usarlo en otros archivos
// (controladores, servicios) y así interactuar con la colección "proyects".
export default Proyect;
