import { pool, type PoolClient } from "../config/db";

export type BookingPaymentStatus = "pending" | "success" | "failed";

export type BookingRow = {
  id: string;
  user_id: string;
  turf_id: string;
  slot_id: string;
  players: number;
  total_price: string;
  payment_status: BookingPaymentStatus;
  booking_date: string;
  created_at: string;
  updated_at: string;
};

export async function createBooking(
  client: PoolClient,
  input: {
    user_id: string;
    turf_id: string;
    slot_id: string;
    players: number;
    total_price: number;
  },
) {
  const res = await client.query<BookingRow>(
    `
    INSERT INTO bookings(user_id, turf_id, slot_id, players, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      input.user_id,
      input.turf_id,
      input.slot_id,
      input.players,
      input.total_price,
    ],
  );
  return res.rows[0]!;
}

export async function listBookingsForUser(userId: string) {
  const res = await pool.query(
    `
    SELECT b.*, t.name as turf_name, t.location, t.sport_type,
           ts.start_time, ts.end_time, ts.status as slot_status
    FROM bookings b
    JOIN turfs t ON t.id = b.turf_id
    JOIN time_slots ts ON ts.id = b.slot_id
    WHERE b.user_id = $1
    ORDER BY b.booking_date DESC
    `,
    [userId],
  );
  return res.rows;
}

export async function listBookingsForOwner(ownerId: string) {
  const res = await pool.query(
    `
    SELECT b.*, t.name as turf_name, t.location, t.sport_type,
           u.name as customer_name, u.email as customer_email,
           ts.start_time, ts.end_time, ts.status as slot_status
    FROM bookings b
    JOIN turfs t ON t.id = b.turf_id
    JOIN users u ON u.id = b.user_id
    JOIN time_slots ts ON ts.id = b.slot_id
    WHERE t.owner_id = $1
    ORDER BY b.booking_date DESC
    `,
    [ownerId],
  );
  return res.rows;
}

export async function listBookingsForAdmin() {
  const res = await pool.query(
    `
    SELECT b.*, t.name as turf_name, t.location, t.sport_type,
           o.name as owner_name, o.email as owner_email,
           u.name as customer_name, u.email as customer_email,
           ts.start_time, ts.end_time, ts.status as slot_status
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

export async function getBookingById(id: string) {
  const res = await pool.query<BookingRow>(`SELECT * FROM bookings WHERE id = $1`, [id]);
  return res.rows[0] ?? null;
}

export async function setBookingPaymentStatus(
  client: PoolClient,
  bookingId: string,
  status: BookingPaymentStatus,
) {
  await client.query(
    `UPDATE bookings SET payment_status = $2, updated_at = datetime('now') WHERE id = $1`,
    [bookingId, status],
  );
  const res = await client.query<BookingRow>(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId],
  );
  return res.rows[0] ?? null;
}
