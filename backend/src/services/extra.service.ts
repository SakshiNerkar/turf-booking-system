import { pool } from "../config/db";

// ── Owner Profiles ────────────────────────────────────────────────────────────
export type OwnerProfileRow = {
  id: string;
  user_id: string;
  business_name: string | null;
  gst_number: string | null;
  bank_account_number: string | null;
  upi_id: string | null;
  total_earnings: number;
  rating: number;
  total_reviews: number;
  is_verified_by_admin: boolean;
  created_at: string;
  updated_at: string;
};

export async function getOwnerProfile(userId: string) {
  const res = await pool.query<OwnerProfileRow>(
    `SELECT * FROM owner_profiles WHERE user_id = $1`,
    [userId]
  );
  return res.rows[0] ?? null;
}

export async function upsertOwnerProfile(userId: string, data: Partial<Omit<OwnerProfileRow, "id" | "user_id" | "created_at" | "updated_at">>) {
  const existing = await getOwnerProfile(userId);
  if (existing) {
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 2}`).join(', ');
    if (!fields) return existing;
    const res = await pool.query<OwnerProfileRow>(
      `UPDATE owner_profiles SET ${fields}, updated_at = now() WHERE user_id = $1 RETURNING *`,
      [userId, ...Object.values(data)]
    );
    return res.rows[0]!;
  }
  const res = await pool.query<OwnerProfileRow>(
    `INSERT INTO owner_profiles(user_id, business_name, gst_number, upi_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, data.business_name ?? null, data.gst_number ?? null, data.upi_id ?? null]
  );
  return res.rows[0]!;
}

// ── Owner Finance ─────────────────────────────────────────────────────────────
export async function getOwnerFinance(ownerId: string) {
  const res = await pool.query(
    `SELECT * FROM owner_finance WHERE owner_id = $1`,
    [ownerId]
  );
  return res.rows[0] ?? { total_earnings: 0, monthly_earnings: 0, pending_payouts: 0 };
}

export async function addOwnerEarnings(ownerId: string, amount: number) {
  await pool.query(
    `INSERT INTO owner_finance(owner_id, total_earnings, monthly_earnings)
     VALUES ($1, $2, $2)
     ON CONFLICT(owner_id) DO UPDATE
     SET total_earnings   = owner_finance.total_earnings + $2,
         monthly_earnings = owner_finance.monthly_earnings + $2`,
    [ownerId, amount]
  );
}

// ── Favorites ─────────────────────────────────────────────────────────────────
export async function getFavorites(userId: string) {
  const res = await pool.query(
    `SELECT f.*, t.name, t.location_city, t.rating,
      (SELECT image_url FROM turf_images WHERE turf_id = t.id AND is_primary = true LIMIT 1) AS turf_image
     FROM favorites f
     JOIN turfs t ON t.id = f.turf_id
     WHERE f.user_id = $1`,
    [userId]
  );
  return res.rows;
}

export async function toggleFavorite(userId: string, turfId: string) {
  const existing = await pool.query(
    `SELECT id FROM favorites WHERE user_id = $1 AND turf_id = $2`,
    [userId, turfId]
  );
  if (existing.rows[0]) {
    await pool.query(`DELETE FROM favorites WHERE user_id = $1 AND turf_id = $2`, [userId, turfId]);
    return { action: "removed" };
  }
  await pool.query(`INSERT INTO favorites(user_id, turf_id) VALUES ($1, $2)`, [userId, turfId]);
  return { action: "added" };
}

// ── Notifications ─────────────────────────────────────────────────────────────
export async function getNotifications(userId: string) {
  const res = await pool.query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [userId]
  );
  return res.rows;
}

export async function createNotification(userId: string, title: string, message: string, type: string) {
  await pool.query(
    `INSERT INTO notifications(user_id, title, message, type) VALUES ($1, $2, $3, $4)`,
    [userId, title, message, type]
  );
}

export async function markNotificationsRead(userId: string) {
  await pool.query(
    `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
}

// ── Admin Extra ────────────────────────────────────────────────────────────────
export async function adminBanUser(userId: string) {
  await pool.query(`UPDATE users SET is_active = false WHERE id = $1 AND role != 'admin'`, [userId]);
  return { banned: true, user_id: userId };
}

export async function adminDeleteUser(userId: string) {
  await pool.query(`DELETE FROM users WHERE id = $1 AND role != 'admin'`, [userId]);
  return { deleted: true, user_id: userId };
}

export async function ownerRevenueBreakdown(ownerId: string) {
  const res = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN b.booking_date = CURRENT_DATE THEN b.total_price ELSE 0 END), 0) AS today,
       COALESCE(SUM(CASE WHEN b.booking_date >= CURRENT_DATE - INTERVAL '6 days' THEN b.total_price ELSE 0 END), 0) AS weekly,
       COALESCE(SUM(CASE WHEN b.booking_date >= date_trunc('month', CURRENT_DATE) THEN b.total_price ELSE 0 END), 0) AS monthly,
       COALESCE(SUM(b.total_price), 0) AS all_time,
       COUNT(b.id) AS total_bookings
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     WHERE t.owner_id = $1 AND b.payment_status = 'paid'`,
    [ownerId]
  );
  return res.rows[0] ?? { today: 0, weekly: 0, monthly: 0, all_time: 0, total_bookings: 0 };
}

export async function cancelBookingService(bookingId: string, userId: string) {
  const res = await pool.query<{ id: string; user_id: string; payment_status: string }>(
    `SELECT id, user_id, payment_status FROM bookings WHERE id = $1`,
    [bookingId]
  );
  const booking = res.rows[0];
  if (!booking) throw Object.assign(new Error("Booking not found"), { status: 404 });
  if (booking.user_id !== userId) throw Object.assign(new Error("Forbidden"), { status: 403 });
  if (booking.payment_status === "paid") throw Object.assign(new Error("Paid bookings cannot be cancelled"), { status: 409 });

  await pool.query(
    `UPDATE bookings SET status = 'cancelled', updated_at = now() WHERE id = $1`,
    [bookingId]
  );
  return { cancelled: true, booking_id: bookingId };
}
