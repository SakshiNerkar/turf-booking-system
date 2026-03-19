import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { createUser, getUserByEmail, toPublicUser } from "../models/user.model";
import type { UserRole } from "../models/user.model";
import { hashPassword, verifyPassword } from "../utils/password";

export async function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}) {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    const err = new Error("Email already registered");
    (err as any).status = 409;
    throw err;
  }

  const hashed = await hashPassword(input.password);
  const user = await createUser({
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: hashed,
    role: input.role,
  });

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { token, user: toPublicUser(user) };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await getUserByEmail(input.email);
  if (!user) {
    const err = new Error("Invalid email or password");
    (err as any).status = 401;
    throw err;
  }

  const ok = await verifyPassword(input.password, user.password);
  if (!ok) {
    const err = new Error("Invalid email or password");
    (err as any).status = 401;
    throw err;
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { token, user: toPublicUser(user) };
}

