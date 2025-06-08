import { Schema, Document, model, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" },
});

const Token = model<IToken>("Token", tokenSchema);

export default Token;
