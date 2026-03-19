import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response";

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route not found: ${req.method} ${req.path}`, 404);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const pgErr = err as any;

  // PostgreSQL unique-constraint violation
  if (pgErr && typeof pgErr.code === "string") {
    if (pgErr.code === "23505") {
      return sendError(res, "This record already exists", 409, {
        code: "CONFLICT",
        details: { constraint: pgErr.constraint },
      });
    }
    // DB connection refused / not running
    if (
      pgErr.code === "ECONNREFUSED" ||
      pgErr.code === "ENOTFOUND" ||
      pgErr.code === "ETIMEDOUT" ||
      pgErr.message?.includes("ECONNREFUSED")
    ) {
      return sendError(
        res,
        "Database is not connected. Please check your DATABASE_URL in backend/.env.",
        503,
        { code: "DB_UNAVAILABLE" },
      );
    }
  }

  // Zod validation
  if (err instanceof ZodError) {
    return sendError(res, "Validation error", 400, {
      code: "VALIDATION_ERROR",
      details: err.flatten(),
    });
  }

  if (err instanceof Error) {
    const anyErr = err as any;

    // DB connection errors by message
    if (
      anyErr.message?.includes("ECONNREFUSED") ||
      anyErr.message?.includes("connect ECONNREFUSED") ||
      anyErr.message?.includes("getaddrinfo") ||
      anyErr.code === "ECONNREFUSED"
    ) {
      return sendError(
        res,
        "Database is not connected. Check your DATABASE_URL environment variable.",
        503,
        { code: "DB_UNAVAILABLE" },
      );
    }

    const status =
      typeof anyErr.status === "number" && Number.isInteger(anyErr.status)
        ? anyErr.status
        : 500;

    const code =
      typeof anyErr.code === "string"
        ? anyErr.code
        : status === 500
          ? "INTERNAL_ERROR"
          : "REQUEST_ERROR";

    return sendError(res, err.message || "Server error", status, { code });
  }

  return sendError(res, "Unknown server error", 500, { code: "INTERNAL_ERROR" });
}
