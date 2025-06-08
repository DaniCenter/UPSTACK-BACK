import { Schema, model, Document, Types } from "mongoose";

const taskEstados = {
  PENDING: "pending",
  ONHOLD: "onHold",
  INPROGRESS: "inProgress",
  UNDERREVIEW: "underReview",
  COMPLETED: "completed",
} as const;

export type TaskEstados = (typeof taskEstados)[keyof typeof taskEstados];

export interface ITask extends Document {
  name: string;
  description: string;
  proyect: Types.ObjectId;
  status: TaskEstados;
  createdAt: Date;
  updatedAt: Date;
  completedBy: {
    user: Types.ObjectId;
    status: TaskEstados;
  }[];
  createdBy: Types.ObjectId;
  notes: Types.ObjectId[];
}

const taskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    proyect: { type: Schema.Types.ObjectId, ref: "Proyect", required: true },
    status: {
      type: String,
      enum: Object.values(taskEstados),
      default: taskEstados.PENDING,
    },
    completedBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: Object.values(taskEstados),
          default: taskEstados.PENDING,
        },
      },
    ],
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
