import type { Response } from "express";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export function sendOk<T>(res: Response, data: T, status = 200) {
  const payload: ApiSuccess<T> = { ok: true, data };
  return res.status(status).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  opts?: { code?: string; details?: unknown },
) {
  const error: ApiError["error"] = { message };
  if (opts?.code !== undefined) error.code = opts.code;
  if (opts?.details !== undefined) error.details = opts.details;

  const payload: ApiError = {
    ok: false,
    error,
  };
  return res.status(status).json(payload);
}

