import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";

export function requireRole(roles: Array<"admin" | "owner" | "user">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return sendError(res, "Unauthorized", 401);
    if (!roles.includes(role)) return sendError(res, "Forbidden", 403);
    return next();
  };
}

