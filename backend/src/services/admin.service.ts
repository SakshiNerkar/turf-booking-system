import { pool } from "../config/db";
import { listUsers, toPublicUser } from "../models/user.model";
import { adminDeactivateTurf } from "../models/turf.model";
import { listAllBookings } from "../models/booking.model";

export async function adminListTurfs() {
  const res = await pool.query(
    `SELECT t.*, u.name as owner_name, u.email as owner_email
     FROM turfs t
     JOIN users u ON u.id = t.owner_id
     WHERE t.deleted_at IS NULL
     ORDER BY t.created_at DESC`
  );
  return res.rows;
}

export async function adminListBookings() {
  return listAllBookings(100);
}

export async function adminRevenueSummary(opts?: { from?: string; to?: string }) {
  const params: string[] = [];
  const conditions: string[] = [`b.payment_status = 'paid'`];

  if (opts?.from) {
    params.push(opts.from);
    conditions.push(`b.booking_date >= $${params.length}`);
  }
  if (opts?.to) {
    params.push(opts.to);
    conditions.push(`b.booking_date <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const res = await pool.query(
    `SELECT 
       t.owner_id, u.name as owner_name,
       b.turf_id, t.name as turf_name,
       ROUND(SUM(b.total_price)::numeric, 2) as total_amount,
       COUNT(b.id) as booking_count
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     JOIN users u ON u.id = t.owner_id
     ${where}
     GROUP BY t.owner_id, u.name, b.turf_id, t.name
     ORDER BY total_amount DESC`,
    params,
  );
  return res.rows;
}

export async function adminListUsers() {
  const users = await listUsers();
  return users.map(toPublicUser);
}

// Fixed: adminDeactivateTurf returns void — just call it, don't check truthiness
export async function adminDeactivateTurfService(turfId: string) {
  const check = await pool.query(`SELECT id FROM turfs WHERE id = $1`, [turfId]);
  if (!check.rows[0]) {
    throw Object.assign(new Error("Turf not found"), { status: 404 });
  }
  await adminDeactivateTurf(turfId);
  return { success: true, turf_id: turfId };
}
