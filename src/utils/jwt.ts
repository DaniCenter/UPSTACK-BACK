import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
};

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
