import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendError } from "../utils/response";

export type JwtPayload = {
  sub: string;
  role: "admin" | "owner" | "customer";
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: JwtPayload["role"] };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return sendError(res, "Missing Authorization token", 401);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch {
    return sendError(res, "Invalid or expired token", 401);
  }
}

