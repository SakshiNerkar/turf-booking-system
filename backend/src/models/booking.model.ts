import { pool } from "../config/db";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed";

export type BookingRow = {
  id: string;
  user_id: string;
  turf_id: string;
  owner_id: string;
  booking_date: string;   // YYYY-MM-DD
  start_time: string;     // HH:MM
  end_time: string;       // HH:MM
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  booking_reference: string;
  created_at: string;
  updated_at: string;
  // Extra fields from joins used in dashboards
  turf_name?: string;
  turf_image?: string;
  user_name?: string;
  user_phone?: string;
  location_city?: string;
  location_address?: string;
  sport_type?: string;
};

export async function createBooking(input: {
  user_id: string;
  turf_id: string;
  owner_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
}) {
  const res = await pool.query<BookingRow>(
    `INSERT INTO bookings(user_id, turf_id, owner_id, booking_date, start_time, end_time, total_price, status, payment_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', 'pending')
     RETURNING *`,
    [
      input.user_id, input.turf_id, input.owner_id,
      input.booking_date, input.start_time, input.end_time, input.total_price,
    ]
  );
  return res.rows[0]!;
}

export async function getBookingById(id: string) {
  const res = await pool.query<BookingRow>(
    `SELECT b.*, 
      t.name AS turf_name, t.sports_available AS sport_type, t.location_city, t.location_address,
      u.name AS user_name, u.phone AS user_phone
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     JOIN users u ON u.id = b.user_id
     WHERE b.id = $1`,
    [id]
  );
  return res.rows[0] ?? null;
}

export async function getBookingsByTurfAndDate(turfId: string, bookingDate: string) {
  const res = await pool.query<BookingRow>(
    `SELECT * FROM bookings
     WHERE turf_id = $1 AND booking_date = $2 AND status != 'cancelled'`,
    [turfId, bookingDate]
  );
  return res.rows;
}

export async function listBookingsForUser(userId: string) {
  const res = await pool.query<BookingRow>(
    `SELECT b.*, 
      t.name AS turf_name, t.sports_available AS sport_type, t.location_city,
      ti.image_url AS turf_image
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     LEFT JOIN turf_images ti ON ti.turf_id = t.id AND ti.is_primary = true
     WHERE b.user_id = $1
     ORDER BY b.booking_date DESC, b.start_time ASC`,
    [userId]
  );
  return res.rows;
}

export async function listBookingsForOwner(ownerId: string) {
  const res = await pool.query<BookingRow>(
    `SELECT b.*,
      t.name AS turf_name, t.sports_available AS sport_type,
      u.name AS user_name, u.phone AS user_phone
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     JOIN users u ON u.id = b.user_id
     WHERE b.owner_id = $1
     ORDER BY b.booking_date DESC, b.start_time ASC`,
    [ownerId]
  );
  return res.rows;
}

export async function listAllBookings(limit = 50, offset = 0) {
  const res = await pool.query<BookingRow>(
    `SELECT b.*,
      t.name AS turf_name, t.sports_available AS sport_type,
      u.name AS user_name
     FROM bookings b
     JOIN turfs t ON t.id = b.turf_id
     JOIN users u ON u.id = b.user_id
     ORDER BY b.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return res.rows;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await pool.query(
    `UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2`,
    [status, id]
  );
}

export async function setBookingPaymentStatus(id: string, status: PaymentStatus) {
  await pool.query(
    `UPDATE bookings SET payment_status = $1, updated_at = now() WHERE id = $2`,
    [status, id]
  );
}
