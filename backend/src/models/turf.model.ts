import { pool } from "../config/db";

export type TurfRow = {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function listTurfs(filters: {
  q?: string;
  location?: string;
  sport_type?: string;
  owner_id?: string;
  min_price?: number;
  max_price?: number;
  limit: number;
  offset: number;
}) {
  const where: string[] = ["is_active = true"];
  const params: Array<string | number> = [];
  const add = (sql: string, val: string | number) => {
    params.push(val);
    where.push(sql.replace("?", `$${params.length}`));
  };

  if (filters.q) {
    const term = `%${filters.q}%`;
    params.push(term, term, term);
    const a = `$${params.length - 2}`;
    const b = `$${params.length - 1}`;
    const c = `$${params.length}`;
    where.push(`(name ilike ${a} or location ilike ${b} or sport_type ilike ${c})`);
  }

  if (filters.location) add("location ilike ?", `%${filters.location}%`);
  if (filters.sport_type) add("sport_type = ?", filters.sport_type);
  if (filters.owner_id) add("owner_id = ?", filters.owner_id);
  if (filters.min_price !== undefined) add("price_per_slot >= ?", filters.min_price);
  if (filters.max_price !== undefined) add("price_per_slot <= ?", filters.max_price);

  params.push(filters.limit);
  const limitParam = `$${params.length}`;
  params.push(filters.offset);
  const offsetParam = `$${params.length}`;

  const res = await pool.query<TurfRow>(
    `
    select *
    from turfs
    where ${where.join(" and ")}
    order by created_at desc
    limit ${limitParam}
    offset ${offsetParam}
  `,
    params,
  );

  return res.rows;
}

export async function getTurfById(id: string) {
  const res = await pool.query<TurfRow>(
    `select * from turfs where id = $1 and is_active = true limit 1`,
    [id],
  );
  return res.rows[0] ?? null;
}

export async function createTurf(input: {
  owner_id: string;
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: number;
  description?: string;
}) {
  const res = await pool.query<TurfRow>(
    `
    insert into turfs(owner_id, name, location, sport_type, price_per_slot, description)
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `,
    [
      input.owner_id,
      input.name,
      input.location,
      input.sport_type,
      input.price_per_slot,
      input.description ?? null,
    ],
  );
  return res.rows[0]!;
}

export async function updateTurf(id: string, ownerId: string, patch: Partial<{
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: number;
  description: string | null;
}>) {
  const fields: string[] = [];
  const params: Array<string | number | null> = [];
  const add = (col: string, val: string | number | null) => {
    params.push(val);
    fields.push(`${col} = $${params.length}`);
  };

  if (patch.name !== undefined) add("name", patch.name);
  if (patch.location !== undefined) add("location", patch.location);
  if (patch.sport_type !== undefined) add("sport_type", patch.sport_type);
  if (patch.price_per_slot !== undefined) add("price_per_slot", patch.price_per_slot);
  if (patch.description !== undefined) add("description", patch.description);

  if (fields.length === 0) return null;

  params.push(id);
  const idParam = `$${params.length}`;
  params.push(ownerId);
  const ownerParam = `$${params.length}`;

  const res = await pool.query<TurfRow>(
    `
    update turfs
    set ${fields.join(", ")}, updated_at = now()
    where id = ${idParam} and owner_id = ${ownerParam} and is_active = true
    returning *
  `,
    params,
  );

  return res.rows[0] ?? null;
}

export async function deactivateTurf(id: string, ownerId: string) {
  const res = await pool.query<TurfRow>(
    `
    update turfs
    set is_active = false, updated_at = now()
    where id = $1 and owner_id = $2 and is_active = true
    returning *
  `,
    [id, ownerId],
  );
  return res.rows[0] ?? null;
}

export async function adminDeactivateTurf(id: string) {
  const res = await pool.query<TurfRow>(
    `
    update turfs
    set is_active = false, updated_at = now()
    where id = $1 and is_active = true
    returning *
  `,
    [id],
  );
  return res.rows[0] ?? null;
}

