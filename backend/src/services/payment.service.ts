import { pool } from "../config/db";
import { getBookingById, setBookingPaymentStatus } from "../models/booking.model";

export type PaymentMethod = "UPI" | "Card" | "Cash" | "NetBanking" | "Wallet";

export async function createPaymentService(input: {
  bookingId: string;
  userId: string;
  payment_method: PaymentMethod;
  amount?: number;
}) {
  const booking = await getBookingById(input.bookingId);
  if (!booking) throw Object.assign(new Error("Booking not found"), { status: 404 });
  if (booking.user_id !== input.userId) throw Object.assign(new Error("Forbidden"), { status: 403 });

  // Record in payments table
  const paymentRes = await pool.query(
    `INSERT INTO payments(booking_id, amount, payment_method, status)
     VALUES ($1, $2, $3, 'pending')
     RETURNING *`,
    [input.bookingId, input.amount ?? booking.total_price, input.payment_method]
  );
  const payment = paymentRes.rows[0];

  // Simulate success — in production integrate Razorpay/Stripe webhook here
  await pool.query(
    `UPDATE payments SET status = 'paid', transaction_id = $1 WHERE id = $2`,
    [`TXN-${Date.now()}`, payment.id]
  );

  // Mark booking as paid
  await setBookingPaymentStatus(input.bookingId, "paid");

  // Credit owner earnings
  await pool.query(
    `INSERT INTO owner_finance(owner_id, total_earnings, monthly_earnings)
     VALUES ($1, $2, $2)
     ON CONFLICT(owner_id) DO UPDATE
     SET total_earnings   = owner_finance.total_earnings + $2,
         monthly_earnings = owner_finance.monthly_earnings + $2`,
    [booking.owner_id, booking.total_price]
  );

  return { success: true, payment: { ...payment, status: "paid" }, booking };
}
