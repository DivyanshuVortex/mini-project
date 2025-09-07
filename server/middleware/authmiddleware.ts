import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    //header Ya cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    req.user = decoded;
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
