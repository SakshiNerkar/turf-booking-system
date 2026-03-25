import { pool } from "../config/db";

export type TurfRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location_city: string;
  location_address: string;
  images: string; // JSON string
  sports_available: string; // comma-separated or JSON
  amenities: string; // JSON string
  price_weekday: number;
  price_weekend: number;
  rating: number;
  total_reviews: number;
  opening_time: string; // e.g. "06:00"
  closing_time: string; // e.g. "23:00"
  slot_duration: number; // in minutes
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getTurfById(id: string) {
  const res = await pool.query<TurfRow>(`select * from turfs where id = $1`, [id]);
  return res.rows[0] ?? null;
}

export async function listTurfs(filters: { city?: string; sport?: string; minPrice?: number; maxPrice?: number } = {}) {
  let sql = `select * from turfs where is_active = 1`;
  const params: any[] = [];

  if (filters.city) {
    params.push(filters.city);
    sql += ` and location_city like $${params.length}`;
  }
  if (filters.sport) {
    params.push(`%${filters.sport}%`);
    sql += ` and sports_available like $${params.length}`;
  }

  const res = await pool.query<TurfRow>(sql, params);
  return res.rows;
}

export async function createTurf(input: Omit<TurfRow, "id" | "is_active" | "created_at" | "updated_at" | "rating" | "total_reviews">) {
  const res = await pool.query<TurfRow>(
    `
    insert into turfs(
      owner_id, name, description, location_city, location_address, 
      images, sports_available, amenities, price_weekday, price_weekend,
      opening_time, closing_time, slot_duration
    )
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    returning *
  `,
    [
      input.owner_id, input.name, input.description, input.location_city, input.location_address,
      input.images, input.sports_available, input.amenities, input.price_weekday, input.price_weekend,
      input.opening_time, input.closing_time, input.slot_duration
    ],
  );
  return res.rows[0]!;
}

export async function deleteTurf(id: string) {
  await pool.query(`delete from turfs where id = $1`, [id]);
}

export async function adminDeactivateTurf(id: string) {
  await deleteTurf(id);
}

export async function getTurfsByOwner(ownerId: string) {
  const res = await pool.query<TurfRow>(`select * from turfs where owner_id = $1`, [ownerId]);
  return res.rows;
}

export async function updateTurfRating(id: string) {
  // Recalculate rating from reviews table
  const res = await pool.query<{ avg: number; count: number }>(
    `select avg(rating) as avg, count(*) as count from reviews where turf_id = $1`,
    [id]
  );
  const { avg, count } = res.rows[0] || { avg: 4.5, count: 0 };
  await pool.query(
    `update turfs set rating = $1, total_reviews = $2 where id = $3`,
    [avg || 4.5, count || 0, id]
  );
}
