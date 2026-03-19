import { pool, type PoolClient } from "../config/db";

export type RevenueRow = {
  id: string;
  owner_id: string;
  turf_id: string;
  amount: string;
  date: string;
  created_at: string;
  updated_at: string;
};

export async function createRevenue(
  client: PoolClient,
  input: { owner_id: string; turf_id: string; amount: number; date?: string },
) {
  // SQLite: use COALESCE with date('now') instead of COALESCE($4::date, current_date)
  const dateVal = input.date ?? new Date().toISOString().slice(0, 10);
  const res = await client.query<RevenueRow>(
    `
    INSERT INTO revenue(owner_id, turf_id, amount, date)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [input.owner_id, input.turf_id, input.amount, dateVal],
  );

  if (res.rows[0]) return res.rows[0];

  // Fallback
  const fetched = await pool.query<RevenueRow>(
    `SELECT * FROM revenue WHERE owner_id = $1 AND turf_id = $2 ORDER BY rowid DESC LIMIT 1`,
    [input.owner_id, input.turf_id],
  );
  return fetched.rows[0]!;
}
