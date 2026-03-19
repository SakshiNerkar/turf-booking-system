import { pool } from "../config/db";

export async function cancelBookingService(bookingId: string, userId: string) {
  const res = await pool.query<{
    id: string;
    slot_id: string;
    payment_status: string;
    user_id: string;
  }>(
    `SELECT id, slot_id, payment_status, user_id FROM bookings WHERE id = $1`,
    [bookingId],
  );
  const booking = res.rows[0];
  if (!booking) {
    const err = new Error("Booking not found");
    (err as any).status = 404;
    throw err;
  }
  if (booking.user_id !== userId) {
    const err = new Error("Forbidden: Not your booking");
    (err as any).status = 403;
    throw err;
  }
  if (booking.payment_status === "success") {
    const err = new Error("Paid bookings cannot be cancelled. Contact support.");
    (err as any).status = 409;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE time_slots SET status = 'available', updated_at = datetime('now') WHERE id = $1`,
      [booking.slot_id],
    );
    await client.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
    await client.query("COMMIT");
    return { cancelled: true, booking_id: bookingId };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function ownerRevenueBreakdown(ownerId: string) {
  // SQLite-compatible date arithmetic
  const res = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN date(b.booking_date) = date('now') THEN b.total_price ELSE 0 END), 0) AS today,
      COALESCE(SUM(CASE WHEN date(b.booking_date) >= date('now', '-6 days') THEN b.total_price ELSE 0 END), 0) AS weekly,
      COALESCE(SUM(CASE WHEN date(b.booking_date) >= date('now', 'start of month') THEN b.total_price ELSE 0 END), 0) AS monthly,
      COALESCE(SUM(b.total_price), 0) AS all_time,
      COUNT(b.id) AS total_bookings,
      COUNT(CASE WHEN b.payment_status = 'success' THEN 1 END) AS paid_bookings
    FROM bookings b
    JOIN turfs t ON t.id = b.turf_id
    WHERE t.owner_id = $1 AND b.payment_status = 'success'
    `,
    [ownerId],
  );
  return res.rows[0] ?? { today: 0, weekly: 0, monthly: 0, all_time: 0, total_bookings: 0, paid_bookings: 0 };
}

export async function adminBanUser(userId: string) {
  // Check first
  const check = await pool.query<{ id: string; role: string }>(
    `SELECT id, role FROM users WHERE id = $1`,
    [userId],
  );
  const user = check.rows[0];
  if (!user || user.role === "admin") {
    const err = new Error("User not found or cannot ban admins");
    (err as any).status = 404;
    throw err;
  }
  await pool.query(
    `UPDATE users SET password = '', updated_at = datetime('now') WHERE id = $1`,
    [userId],
  );
  return { banned: true, user_id: userId };
}

export async function adminDeleteUser(userId: string) {
  const check = await pool.query<{ id: string; role: string }>(
    `SELECT id, role FROM users WHERE id = $1`,
    [userId],
  );
  const user = check.rows[0];
  if (!user || user.role === "admin") {
    const err = new Error("User not found or cannot delete admins");
    (err as any).status = 404;
    throw err;
  }
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return { deleted: true, user_id: userId };
}
