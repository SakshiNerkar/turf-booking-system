import { pool } from "../config/db";
import { listUsers, toPublicUser } from "../models/user.model";
import { adminDeactivateTurf } from "../models/turf.model";

export async function adminListTurfs() {
  const res = await pool.query(
    `
    SELECT t.*, u.name as owner_name, u.email as owner_email
    FROM turfs t
    JOIN users u ON u.id = t.owner_id
    ORDER BY t.created_at DESC
    `,
  );
  return res.rows;
}

export async function adminListBookings() {
  const res = await pool.query(
    `
    SELECT b.*, t.name as turf_name, t.location, t.sport_type,
           o.name as owner_name, o.email as owner_email,
           u.name as customer_name, u.email as customer_email,
           ts.start_time, ts.end_time
    FROM bookings b
    JOIN turfs t ON t.id = b.turf_id
    JOIN users o ON o.id = t.owner_id
    JOIN users u ON u.id = b.user_id
    JOIN time_slots ts ON ts.id = b.slot_id
    ORDER BY b.booking_date DESC
    `,
  );
  return res.rows;
}

export async function adminRevenueSummary(opts?: { from?: string; to?: string }) {
  // SQLite-compatible: no DATE_TRUNC, no INTERVAL
  let where = "";
  const params: string[] = [];

  if (opts?.from) {
    params.push(opts.from);
    where += (where ? " AND " : "WHERE ") + `date(r.date) >= date($${params.length})`;
  }
  if (opts?.to) {
    params.push(opts.to);
    where += (where ? " AND " : "WHERE ") + `date(r.date) <= date($${params.length})`;
  }

  const res = await pool.query(
    `
    SELECT r.owner_id, o.name as owner_name,
           r.turf_id, t.name as turf_name,
           ROUND(SUM(r.amount), 2) as total_amount,
           MIN(r.date) as from_date,
           MAX(r.date) as to_date
    FROM revenue r
    JOIN users o ON o.id = r.owner_id
    JOIN turfs t ON t.id = r.turf_id
    ${where}
    GROUP BY r.owner_id, o.name, r.turf_id, t.name
    ORDER BY total_amount DESC
    `,
    params,
  );

  return res.rows;
}

export async function adminListUsers() {
  const users = await listUsers();
  return users.map(toPublicUser);
}

export async function adminDeactivateTurfService(turfId: string) {
  const turf = await adminDeactivateTurf(turfId);
  if (!turf) {
    const err = new Error("Turf not found");
    (err as any).status = 404;
    throw err;
  }
  return turf;
}
