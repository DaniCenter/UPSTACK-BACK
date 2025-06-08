import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import User, { type IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN", token);
  console.log(req.headers);
  console.log("--------------------------------");
  if (!token) {
    res.status(401).json({ message: "No se proporcionó un token" });
    return;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401).json({ message: "Usuario no encontrado" });
    return;
  }
  req.user = user;
  next();
};
