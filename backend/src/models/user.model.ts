import { pool } from "../config/db";

export type UserRole = "admin" | "owner" | "user";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  profile_image: string | null;
  favorites: string; // JSON string of turf IDs
  role: UserRole;
  earnings_total: number;
  earnings_monthly: number;
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
  profile_image?: string;
}) {
  const res = await pool.query<UserRow>(
    `
    insert into users(name, email, phone, password, role, profile_image)
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `,
    [
      input.name, 
      input.email, 
      input.phone ?? null, 
      input.password, 
      input.role, 
      input.profile_image ?? null
    ],
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

