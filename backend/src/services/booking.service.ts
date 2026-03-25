import { pool } from "../config/db";
import { createBooking } from "../models/booking.model";
import { getTurfById } from "../models/turf.model";

export async function createBookingService(input: {
  userId: string;
  turfId: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const turf = await getTurfById(input.turfId);
  if (!turf) throw new Error("Turf not found");

  // PRICE LOGIC: Weekday vs Weekend
  const day = new Date(input.date).getDay();
  const isWeekend = day === 0 || day === 6;
  const price = isWeekend ? turf.price_weekend : turf.price_weekday;

  // Calculate duration in hours for price
  const startH = Number(input.startTime.split(':')[0]) || 0;
  const endH = Number(input.endTime.split(':')[0]) || 0;
  const duration = Math.max(1, endH - startH);
  const totalPrice = price * (duration || 1);

  const booking = await createBooking({
    user_id: input.userId,
    turf_id: input.turfId,
    owner_id: turf.owner_id,
    date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    total_price: totalPrice,
    status: "confirmed"
  });

  // Automated Earnings Update
  await pool.query(
    `update users set earnings_total = earnings_total + $1, earnings_monthly = earnings_monthly + $1 where id = $2`,
    [totalPrice, turf.owner_id]
  );

  return booking;
}
