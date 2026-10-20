import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const userId = token ? await verifyToken(token) : null;
  if (!userId) return res.status(401).json({ message: "No autorizado" });
  res.locals.userId = userId;
  next();
}