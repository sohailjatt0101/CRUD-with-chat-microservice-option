
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (userId: String, name: String) => {
  return jwt.sign({ id: userId, name}, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
};