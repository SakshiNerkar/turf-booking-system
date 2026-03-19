import { pool } from "../config/db";
import { getBookingById, setBookingPaymentStatus } from "../models/booking.model";
import { createPayment, type PaymentStatus, type PaymentType } from "../models/payment.model";
import { createRevenue } from "../models/revenue.model";

export async function createPaymentService(input: {
  bookingId: string;
  userId: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
}) {
  const booking = await getBookingById(input.bookingId);
  if (!booking) {
    const err = new Error("Booking not found");
    (err as any).status = 404;
    throw err;
  }
  if (booking.user_id !== input.userId) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");

    const updatedBooking = await setBookingPaymentStatus(
      client,
      input.bookingId,
      input.payment_status,
    );
    if (!updatedBooking) {
      const err = new Error("Booking not found");
      (err as any).status = 404;
      throw err;
    }

    const payment = await createPayment(client, {
      booking_id: input.bookingId,
      payment_type: input.payment_type,
      payment_status: input.payment_status,
    });

    let revenue = null as null | { id: string };
    if (input.payment_status === "success") {
      const ownerRes = await client.query<{ owner_id: string; total_price: string }>(
        `
        select t.owner_id, b.total_price
        from bookings b
        join turfs t on t.id = b.turf_id
        where b.id = $1
      `,
        [input.bookingId],
      );
      const row = ownerRes.rows[0];
      if (row) {
        revenue = await createRevenue(client, {
          owner_id: row.owner_id,
          turf_id: updatedBooking.turf_id,
          amount: Number(row.total_price),
        });
      }
    }

    await client.query("commit");
    return { booking: updatedBooking, payment, revenue };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

