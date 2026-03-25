import { pool } from "../config/db";

export type UserRole = "admin" | "owner" | "user";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
  profile_image: string | null;
  is_verified: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicUser = Omit<UserRow, "password">;

export async function getUserByEmail(email: string) {
  const res = await pool.query<UserRow>(
    `SELECT * FROM users WHERE email = $1 AND is_active = true LIMIT 1`,
    [email],
  );
  return res.rows[0] ?? null;
}

export async function getUserById(id: string) {
  const res = await pool.query<UserRow>(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]
  );
  return res.rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<UserRole, "admin">;
  profile_image?: string;
}) {
  const res = await pool.query<UserRow>(
    `INSERT INTO users(name, email, phone, password, role, profile_image)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.name,
      input.email,
      input.phone ?? null,
      input.password,
      input.role,
      input.profile_image ?? null,
    ],
  );
  return res.rows[0]!;
}

export async function updateLastLogin(id: string) {
  await pool.query(`UPDATE users SET last_login = now() WHERE id = $1`, [id]);
}

export async function listUsers() {
  const res = await pool.query<UserRow>(
    `SELECT id, name, email, phone, role, is_verified, is_active, last_login, created_at
     FROM users ORDER BY created_at DESC`
  );
  return res.rows;
}

export async function deactivateUser(id: string) {
  await pool.query(`UPDATE users SET is_active = false WHERE id = $1`, [id]);
}

export async function deleteUser(id: string) {
  await pool.query(`DELETE FROM users WHERE id = $1 AND role != 'admin'`, [id]);
}

export function toPublicUser(u: UserRow): PublicUser {
  const { password: _pw, ...rest } = u;
  return rest;
}
