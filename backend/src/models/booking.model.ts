import { pool } from "../config/db";

export type BookingRow = {
  id: string;
  user_id: string;
  turf_id: string;
  owner_id: string;
  date: string; // ISO Date YYYY-MM-DD
  start_time: string; // e.g. "06:00"
  end_time: string; // e.g. "07:00"
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
};

export async function createBooking(input: Omit<BookingRow, "id" | "created_at" | "updated_at">) {
  const res = await pool.query<BookingRow>(
    `
    insert into bookings(user_id, turf_id, owner_id, date, start_time, end_time, total_price, status)
    values ($1, $2, $3, $4, $5, $6, $7, $8)
    returning *
  `,
    [
      input.user_id, input.turf_id, input.owner_id, 
      input.date, input.start_time, input.end_time, 
      input.total_price, input.status
    ],
  );
  return res.rows[0]!;
}

export async function getBookingById(id: string) {
  const res = await pool.query<BookingRow>(`select * from bookings where id = $1`, [id]);
  return res.rows[0] || null;
}

export async function getBookingsByTurfAndDate(turfId: string, date: string) {
  const res = await pool.query<BookingRow>(
    `select * from bookings where turf_id = $1 and date = $2 and status != 'cancelled'`,
    [turfId, date]
  );
  return res.rows;
}

export async function listBookingsForUser(userId: string) {
  const res = await pool.query<BookingRow>(
    `select b.*, t.name as turf_name, t.location_city 
     from bookings b
     join turfs t on b.turf_id = t.id
     where b.user_id = $1 
     order by b.date desc`,
    [userId]
  );
  return res.rows;
}

export async function listBookingsForOwner(ownerId: string) {
  const res = await pool.query<BookingRow>(
    `select b.*, t.name as turf_name, u.name as user_name
     from bookings b
     join turfs t on b.turf_id = t.id
     join users u on b.user_id = u.id
     where b.owner_id = $1 
     order by b.date desc`,
    [ownerId]
  );
  return res.rows;
}

export async function updateBookingStatus(id: string, status: string) {
  await pool.query(`update bookings set status = $1 where id = $2`, [status, id]);
}

export async function setBookingPaymentStatus(id: string, status: string) {
  await updateBookingStatus(id, status);
}
