import { Document, model, Schema, Types } from "mongoose";

export interface INote extends Document {
  content: string;
  createdBy: Types.ObjectId;
  task: Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export const Note = model<INote>("Note", noteSchema);
