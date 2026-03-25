import { pool } from "../config/db";

export type ReviewRow = {
  id: string;
  user_id: string;
  turf_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export async function createReview(input: {
  user_id: string;
  turf_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
}) {
  const res = await pool.query<ReviewRow>(
    `INSERT INTO reviews(user_id, turf_id, booking_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.user_id, input.turf_id, input.booking_id, input.rating, input.comment ?? null]
  );
  return res.rows[0]!;
}

export async function getReviewsByTurf(turfId: string) {
  const res = await pool.query<ReviewRow & { user_name: string; user_image: string }>(
    `SELECT r.*, u.name AS user_name, u.profile_image AS user_image
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.turf_id = $1
     ORDER BY r.created_at DESC`,
    [turfId]
  );
  return res.rows;
}

export async function hasUserReviewedBooking(bookingId: string) {
  const res = await pool.query<{ count: string }>(
    `SELECT COUNT(*) as count FROM reviews WHERE booking_id = $1`,
    [bookingId]
  );
  return Number(res.rows[0]?.count ?? 0) > 0;
}
