import { pool, type PoolClient } from "../config/db";

export type TimeSlotStatus = "available" | "booked" | "blocked";

export type TimeSlotRow = {
  id: string;
  turf_id: string;
  start_time: string;
  end_time: string;
  status: TimeSlotStatus;
  created_at: string;
  updated_at: string;
};

export async function listTimeSlotsByTurfId(turfId: string, opts?: {
  from?: string;
  to?: string;
}) {
  const where: string[] = ["turf_id = $1"];
  const params: Array<string> = [turfId];

  if (opts?.from) {
    params.push(opts.from);
    where.push(`start_time >= $${params.length}`);
  }
  if (opts?.to) {
    params.push(opts.to);
    where.push(`end_time <= $${params.length}`);
  }

  const res = await pool.query<TimeSlotRow>(
    `
    SELECT *
    FROM time_slots
    WHERE ${where.join(" AND ")}
    ORDER BY start_time ASC
    `,
    params,
  );

  return res.rows;
}

// SQLite doesn't support FOR UPDATE — just do a regular SELECT within the transaction
export async function lockTimeSlot(
  client: PoolClient,
  input: { slotId: string; turfId: string },
) {
  const res = await client.query<TimeSlotRow>(
    `SELECT * FROM time_slots WHERE id = $1 AND turf_id = $2`,
    [input.slotId, input.turfId],
  );
  return res.rows[0] ?? null;
}

export async function setTimeSlotStatus(
  client: PoolClient,
  slotId: string,
  status: TimeSlotStatus,
) {
  // UPDATE then re-fetch (RETURNING handled by adapter but let's be explicit)
  await client.query(
    `UPDATE time_slots SET status = $2, updated_at = datetime('now') WHERE id = $1`,
    [slotId, status],
  );
  const res = await client.query<TimeSlotRow>(
    `SELECT * FROM time_slots WHERE id = $1`,
    [slotId],
  );
  return res.rows[0] ?? null;
}

export async function createTimeSlot(input: {
  turf_id: string;
  start_time: string;
  end_time: string;
  status?: TimeSlotStatus;
}) {
  const res = await pool.query<TimeSlotRow>(
    `
    INSERT INTO time_slots(turf_id, start_time, end_time, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [input.turf_id, input.start_time, input.end_time, input.status ?? "available"],
  );
  return res.rows[0]!;
}

export async function setTimeSlotStatusOwned(input: {
  slot_id: string;
  owner_id: string;
  status: TimeSlotStatus;
}) {
  // SQLite doesn't support UPDATE...FROM...JOIN — use a subquery instead
  const checkRes = await pool.query<{ id: string }>(
    `
    SELECT ts.id FROM time_slots ts
    JOIN turfs t ON t.id = ts.turf_id
    WHERE ts.id = $1 AND t.owner_id = $2
    `,
    [input.slot_id, input.owner_id],
  );
  if (!checkRes.rows[0]) return null;

  await pool.query(
    `UPDATE time_slots SET status = $2, updated_at = datetime('now') WHERE id = $1`,
    [input.slot_id, input.status],
  );
  const res = await pool.query<TimeSlotRow>(
    `SELECT * FROM time_slots WHERE id = $1`,
    [input.slot_id],
  );
  return res.rows[0] ?? null;
}
