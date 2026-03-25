import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { createUser, getUserByEmail, toPublicUser, updateLastLogin } from "../models/user.model";
import type { UserRole } from "../models/user.model";
import { hashPassword, verifyPassword } from "../utils/password";
import { pool } from "../config/db";

export async function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}) {
  const existing = await getUserByEmail(input.email);
  if (existing) throw Object.assign(new Error("Email already registered"), { status: 409 });

  const hashed = await hashPassword(input.password);
  const user = await createUser({ ...input, password: hashed });

  // Auto-create owner_profile for owner registrations
  if (user.role === "owner") {
    await pool.query(
      `INSERT INTO owner_profiles(user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [user.id]
    );
    await pool.query(
      `INSERT INTO owner_finance(owner_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [user.id]
    );
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { token, user: toPublicUser(user) };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await getUserByEmail(input.email);
  if (!user) throw Object.assign(new Error("Invalid email or password"), { status: 401 });
  if (!user.is_active) throw Object.assign(new Error("Account is deactivated"), { status: 403 });

  const ok = await verifyPassword(input.password, user.password);
  if (!ok) throw Object.assign(new Error("Invalid email or password"), { status: 401 });

  await updateLastLogin(user.id);

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return { token, user: toPublicUser(user) };
}
