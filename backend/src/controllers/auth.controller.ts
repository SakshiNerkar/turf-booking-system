import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { loginUser, registerUser } from "../services/auth.service";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional(),
  password: z.string().min(6),
  role: z.enum(["owner", "customer"]),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const body = RegisterSchema.parse(req.body);
  const result = await registerUser(body);
  return sendOk(res, result, 201);
}

export async function login(req: Request, res: Response) {
  const body = LoginSchema.parse(req.body);
  const result = await loginUser(body);
  return sendOk(res, result);
}

