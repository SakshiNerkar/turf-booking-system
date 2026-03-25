import { pool } from "../config/db";
import { createReview as insertReview, getReviewsByTurf, hasUserReviewedBooking } from "../models/review.model";

export async function addReviewService(userId: string, input: {
  turfId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  // Verify the booking belongs to this user and is completed
  const res = await pool.query<{ user_id: string; status: string }>(
    `SELECT user_id, status FROM bookings WHERE id = $1`,
    [input.bookingId]
  );
  const booking = res.rows[0];
  if (!booking) throw Object.assign(new Error("Booking not found"), { status: 404 });
  if (booking.user_id !== userId) throw Object.assign(new Error("Forbidden"), { status: 403 });

  const alreadyReviewed = await hasUserReviewedBooking(input.bookingId);
  if (alreadyReviewed) throw Object.assign(new Error("Already reviewed this booking"), { status: 409 });

  // Rating auto-updates turf via DB trigger
  return insertReview({
    user_id: userId,
    turf_id: input.turfId,
    booking_id: input.bookingId,
    rating: input.rating,
    comment: input.comment,
  });
}

export { getReviewsByTurf as getTurfReviewsService };
