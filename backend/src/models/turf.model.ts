import { pool } from "../config/db";

export type TurfRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location_city: string;
  location_address: string;
  images: string; // JSON string in DB
  sports_available: string;
  amenities: string; // JSON string in DB
  price_weekday: number;
  price_weekend: number;
  rating: number;
  total_reviews: number;
  opening_time: string;
  closing_time: string;
  slot_duration: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getTurfById(id: string) {
  const res = await pool.query<TurfRow>(
    `SELECT * FROM turfs WHERE id = $1 LIMIT 1`,
    [id]
  );
  return res.rows[0] ?? null;
}

export async function listTurfs(filters: {
  city?: string;
  sport?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const params: any[] = [];
  const conditions = [`is_active = true`];

  if (filters.city) {
    params.push(`%${filters.city}%`);
    conditions.push(`location_city ILIKE $${params.length}`);
  }
  if (filters.sport) {
    params.push(`%${filters.sport}%`);
    conditions.push(`sports_available ILIKE $${params.length}`);
  }

  const limit = parseInt(String(filters.limit ?? 50), 10);
  const offset = parseInt(String(filters.offset ?? 0), 10);
  params.push(limit, offset);

  const sql = `
    SELECT * FROM turfs
    WHERE ${conditions.join(' AND ')}
    ORDER BY rating DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const res = await pool.query<TurfRow>(sql, params);
  return res.rows;
}

export async function getTurfsByOwner(ownerId: string) {
  const res = await pool.query<TurfRow>(
    `SELECT * FROM turfs WHERE owner_id = $1 ORDER BY created_at DESC`,
    [ownerId]
  );
  return res.rows;
}

export async function createTurf(input: any) {
  const res = await pool.query<TurfRow>(
    `INSERT INTO turfs(
      owner_id, name, description, location_city, location_address,
      images, sports_available, amenities,
      price_weekday, price_weekend, opening_time, closing_time, slot_duration
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    [
      input.owner_id, input.name, input.description ?? null,
      input.location_city, input.location_address,
      JSON.stringify(input.images || []), input.sports_available, JSON.stringify(input.amenities || []),
      input.price_weekday, input.price_weekend,
      input.opening_time, input.closing_time, input.slot_duration,
    ]
  );
  return res.rows[0]!;
}
export async function softDeleteTurf(id: string) {
  await pool.query(`UPDATE turfs SET is_active = false WHERE id = $1`, [id]);
}

export async function adminDeactivateTurf(id: string) {
  await pool.query(`UPDATE turfs SET is_active = false WHERE id = $1`, [id]);
}
