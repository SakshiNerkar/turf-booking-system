import { getTurfById } from "../models/turf.model";
import { getBookingsByTurfAndDate } from "../models/booking.model";
import { createBooking } from "../models/booking.model";
import { addOwnerEarnings, createNotification } from "./extra.service";

// ── Dynamic Slot Generation ───────────────────────────────────────────────────
function generateSlots(openingTime: string, closingTime: string, slotDuration: number) {
  const slots: { start: string; end: string }[] = [];
  const openParts = openingTime.split(":").map(Number);
  const closeParts = closingTime.split(":").map(Number);
  const oh = openParts[0] ?? 6;
  const om = openParts[1] ?? 0;
  const ch = closeParts[0] ?? 23;
  const cm = closeParts[1] ?? 0;
  let cursor = oh * 60 + om;
  const limit = ch * 60 + cm;

  while (cursor + slotDuration <= limit) {
    const start = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
    cursor += slotDuration;
    const end = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
    slots.push({ start, end });
  }
  return slots;
}

// ── Turf + Available Slots ────────────────────────────────────────────────────
export async function getTurfSlotsService(turfId: string, date: string) {
  const turf = await getTurfById(turfId);
  if (!turf) throw Object.assign(new Error("Turf not found"), { status: 404 });

  const bookings = await getBookingsByTurfAndDate(turfId, date);
  const bookedTimes = new Set(bookings.map((b) => b.start_time));

  const allSlots = generateSlots(turf.opening_time, turf.closing_time, turf.slot_duration);
  const slots = allSlots.map((s) => ({
    start_time: s.start,
    end_time: s.end,
    status: bookedTimes.has(s.start) ? "booked" : "available",
  }));

  return { turf, slots };
}

// ── Create Booking + Revenue ──────────────────────────────────────────────────
export async function createBookingService(input: {
  userId: string;
  turfId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}) {
  const turf = await getTurfById(input.turfId);
  if (!turf) throw Object.assign(new Error("Turf not found"), { status: 404 });
  if (!turf.is_active) throw Object.assign(new Error("Turf is not available"), { status: 400 });

  // Weekday vs Weekend pricing
  const day = new Date(input.bookingDate).getDay();
  const isWeekend = day === 0 || day === 6;
  const pricePerHour = isWeekend ? turf.price_weekend : turf.price_weekday;

  const startH = parseInt(input.startTime.split(":")[0] ?? "0", 10);
  const endH = parseInt(input.endTime.split(":")[0] ?? "0", 10);
  const durationHours = Math.max(1, endH - startH);
  const totalPrice = pricePerHour * durationHours;

  const booking = await createBooking({
    user_id: input.userId,
    turf_id: input.turfId,
    owner_id: turf.owner_id,
    booking_date: input.bookingDate,
    start_time: input.startTime,
    end_time: input.endTime,
    total_price: totalPrice,
  });

  // Async side-effects (non-blocking)
  addOwnerEarnings(turf.owner_id, totalPrice).catch(() => {});
  createNotification(
    input.userId, "Booking Confirmed! 🎉",
    `Your slot at ${turf.name} on ${input.bookingDate} (${input.startTime}–${input.endTime}) is confirmed.`,
    "booking"
  ).catch(() => {});

  return booking;
}

export { listTurfs as listTurfsService } from "../models/turf.model";
export { createTurf as createTurfService } from "../models/turf.model";
export { softDeleteTurf as deleteTurfService } from "../models/turf.model";
