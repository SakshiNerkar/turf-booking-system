import { pool } from "../config/db";

export type TurfRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  location_city: string;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  sports_available: string;
  price_weekday: number;
  price_weekend: number;
  opening_time: string;
  closing_time: string;
  slot_duration: number;
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function getTurfById(id: string) {
  const res = await pool.query<TurfRow>(
    `SELECT t.*, 
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', ti.id, 'url', ti.image_url, 'is_primary', ti.is_primary))
        FILTER (WHERE ti.id IS NOT NULL), '[]'
      ) AS images,
      COALESCE(
        json_agg(DISTINCT a.name) FILTER (WHERE a.id IS NOT NULL), '[]'
      ) AS amenities
     FROM turfs t
     LEFT JOIN turf_images ti ON ti.turf_id = t.id
     LEFT JOIN turf_amenity_map tam ON tam.turf_id = t.id
     LEFT JOIN amenities a ON a.id = tam.amenity_id
     WHERE t.id = $1 AND t.deleted_at IS NULL
     GROUP BY t.id`,
    [id]
  );
  return res.rows[0] ?? null;
}

export async function listTurfs(filters: {
  city?: string;
  sport?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
} = {}) {
  const params: any[] = [];
  const conditions = [`t.is_active = true`, `t.deleted_at IS NULL`];

  if (filters.city) {
    params.push(`%${filters.city}%`);
    conditions.push(`t.location_city ILIKE $${params.length}`);
  }
  if (filters.sport) {
    params.push(`%${filters.sport}%`);
    conditions.push(`t.sports_available ILIKE $${params.length}`);
  }
  if (filters.minPrice) {
    params.push(filters.minPrice);
    conditions.push(`t.price_weekday >= $${params.length}`);
  }
  if (filters.maxPrice) {
    params.push(filters.maxPrice);
    conditions.push(`t.price_weekday <= $${params.length}`);
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;
  params.push(limit, offset);

  const sql = `
    SELECT t.*,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('url', ti.image_url, 'is_primary', ti.is_primary))
        FILTER (WHERE ti.id IS NOT NULL), '[]'
      ) AS images,
      COALESCE(
        json_agg(DISTINCT a.name) FILTER (WHERE a.id IS NOT NULL), '[]'
      ) AS amenities
    FROM turfs t
    LEFT JOIN turf_images ti ON ti.turf_id = t.id
    LEFT JOIN turf_amenity_map tam ON tam.turf_id = t.id
    LEFT JOIN amenities a ON a.id = tam.amenity_id
    WHERE ${conditions.join(' AND ')}
    GROUP BY t.id
    ORDER BY t.is_featured DESC, t.rating DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const res = await pool.query<TurfRow>(sql, params);
  return res.rows;
}

export async function createTurf(input: {
  owner_id: string;
  name: string;
  description?: string;
  location_city: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  sports_available: string;
  price_weekday: number;
  price_weekend: number;
  opening_time: string;
  closing_time: string;
  slot_duration: number;
}) {
  const res = await pool.query<TurfRow>(
    `INSERT INTO turfs(
      owner_id, name, description, location_city, location_address,
      latitude, longitude, sports_available,
      price_weekday, price_weekend, opening_time, closing_time, slot_duration
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    [
      input.owner_id, input.name, input.description ?? null,
      input.location_city, input.location_address,
      input.latitude ?? null, input.longitude ?? null,
      input.sports_available,
      input.price_weekday, input.price_weekend,
      input.opening_time, input.closing_time, input.slot_duration,
    ]
  );
  return res.rows[0]!;
}

export async function softDeleteTurf(id: string) {
  await pool.query(`UPDATE turfs SET deleted_at = now() WHERE id = $1`, [id]);
}

export async function adminDeactivateTurf(id: string) {
  await pool.query(`UPDATE turfs SET is_active = false WHERE id = $1`, [id]);
}

export async function getTurfsByOwner(ownerId: string) {
  const res = await pool.query<TurfRow>(
    `SELECT t.*,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('url', ti.image_url, 'is_primary', ti.is_primary))
        FILTER (WHERE ti.id IS NOT NULL), '[]'
      ) AS images
     FROM turfs t
     LEFT JOIN turf_images ti ON ti.turf_id = t.id
     WHERE t.owner_id = $1 AND t.deleted_at IS NULL
     GROUP BY t.id
     ORDER BY t.created_at DESC`,
    [ownerId]
  );
  return res.rows;
}

export async function addTurfImage(turfId: string, imageUrl: string, isPrimary = false) {
  if (isPrimary) {
    await pool.query(`UPDATE turf_images SET is_primary = false WHERE turf_id = $1`, [turfId]);
  }
  await pool.query(
    `INSERT INTO turf_images(turf_id, image_url, is_primary) VALUES ($1, $2, $3)`,
    [turfId, imageUrl, isPrimary]
  );
}
