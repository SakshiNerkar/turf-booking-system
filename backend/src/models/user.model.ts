import { pool } from "../config/db";

export type UserRole = "admin" | "owner" | "customer";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export async function getUserByEmail(email: string) {
  const res = await pool.query<UserRow>(
    `select * from users where email = $1 limit 1`,
    [email],
  );
  return res.rows[0] ?? null;
}

export async function getUserById(id: string) {
  const res = await pool.query<UserRow>(`select * from users where id = $1`, [
    id,
  ]);
  return res.rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}) {
  const res = await pool.query<UserRow>(
    `
    insert into users(name, email, phone, password, role)
    values ($1, $2, $3, $4, $5)
    returning *
  `,
    [input.name, input.email, input.phone ?? null, input.password, input.role],
  );
  return res.rows[0]!;
}

export async function listUsers() {
  const res = await pool.query<UserRow>(
    `select * from users order by created_at desc`,
  );
  return res.rows;
}

export type PublicUser = Omit<UserRow, "password">;

export function toPublicUser(u: UserRow): PublicUser {
  const { password: _password, ...rest } = u;
  return rest;
}

