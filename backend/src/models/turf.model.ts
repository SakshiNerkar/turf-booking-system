import { pool } from "../config/db";

export type TurfRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location_city: string;
  location_address: string;
  sports_available: string;
  amenities: string; 
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
  // Joined fields
  primary_image?: string;
  images?: string[];
};

export async function getTurfById(id: string) {
  const res = await pool.query<TurfRow>(
    `SELECT t.*, 
       (SELECT image_url FROM turf_images WHERE turf_id = t.id AND is_primary = true LIMIT 1) as primary_image
     FROM turfs t WHERE t.id = $1 LIMIT 1`,
    [id]
  );
  const turf = res.rows[0];
  if (!turf) return null;

  const imgRes = await pool.query<{ image_url: string }>(
    `SELECT image_url FROM turf_images WHERE turf_id = $1 ORDER BY is_primary DESC, created_at ASC`,
    [id]
  );
  turf.images = imgRes.rows.map(r => r.image_url);
  
  return turf;
}

export async function listTurfs(filters: {
  city?: string;
  sport?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const params: any[] = [];
  const conditions = [`t.is_active = true`];

  if (filters.city) {
    params.push(`%${filters.city}%`);
    conditions.push(`t.location_city ILIKE $${params.length}`);
  }
  if (filters.sport) {
    params.push(`%${filters.sport}%`);
    conditions.push(`t.sports_available ILIKE $${params.length}`);
  }

  const limit = parseInt(String(filters.limit ?? 50), 10);
  const offset = parseInt(String(filters.offset ?? 0), 10);
  params.push(limit, offset);

  const sql = `
    SELECT t.*, 
      (SELECT image_url FROM turf_images WHERE turf_id = t.id AND is_primary = true LIMIT 1) as primary_image
    FROM turfs t
    WHERE ${conditions.join(' AND ')}
    ORDER BY t.rating DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const res = await pool.query<TurfRow>(sql, params);
  return res.rows;
}

export async function getTurfsByOwner(ownerId: string) {
  const res = await pool.query<TurfRow>(
    `SELECT t.*,
       (SELECT image_url FROM turf_images WHERE turf_id = t.id AND is_primary = true LIMIT 1) as primary_image
     FROM turfs t WHERE t.owner_id = $1 ORDER BY t.created_at DESC`,
    [ownerId]
  );
  return res.rows;
}

export async function createTurf(input: any) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const turfRes = await client.query<TurfRow>(
      `INSERT INTO turfs(
        owner_id, name, description, location_city, location_address,
        sports_available, amenities,
        price_weekday, price_weekend, opening_time, closing_time, slot_duration
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        input.owner_id, input.name, input.description ?? null,
        input.location_city, input.location_address,
        input.sports_available, JSON.stringify(input.amenities || []),
        input.price_weekday, input.price_weekend,
        input.opening_time, input.closing_time, input.slot_duration,
      ]
    );
    
    const turf = turfRes.rows[0]!;
    
    if (input.images && Array.isArray(input.images)) {
      for (let i = 0; i < input.images.length; i++) {
        await client.query(
          `INSERT INTO turf_images (turf_id, image_url, is_primary) 
           VALUES ($1, $2, $3)`,
          [turf.id, input.images[i], i === 0]
        );
      }
    }
    
    await client.query('COMMIT');
    return turf;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
export async function softDeleteTurf(id: string) {
  await pool.query(`UPDATE turfs SET is_active = false WHERE id = $1`, [id]);
}

export async function adminDeactivateTurf(id: string) {
  await pool.query(`UPDATE turfs SET is_active = false WHERE id = $1`, [id]);
}
