import { pool } from "../config/db";
import { createBooking, listBookingsForAdmin, listBookingsForOwner, listBookingsForUser } from "../models/booking.model";
import { lockTimeSlot, setTimeSlotStatus } from "../models/timeslot.model";

export async function createBookingService(input: {
  userId: string;
  turfId: string;
  slotId: string;
  players: number;
}) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    const slot = await lockTimeSlot(client, {
      slotId: input.slotId,
      turfId: input.turfId,
    });
    if (!slot) {
      const err = new Error("Time slot not found");
      (err as any).status = 404;
      throw err;
    }
    if (slot.status !== "available") {
      const err = new Error("Slot already booked or blocked");
      (err as any).status = 409;
      throw err;
    }

    const turfRes = await client.query<{ price_per_slot: string }>(
      `select price_per_slot from turfs where id = $1 and is_active = true`,
      [input.turfId],
    );
    const priceStr = turfRes.rows[0]?.price_per_slot;
    if (!priceStr) {
      const err = new Error("Turf not found");
      (err as any).status = 404;
      throw err;
    }

    const totalPrice = Number(priceStr);
    if (!Number.isFinite(totalPrice)) {
      const err = new Error("Invalid turf pricing");
      (err as any).status = 500;
      throw err;
    }

    await setTimeSlotStatus(client, input.slotId, "booked");

    const booking = await createBooking(client, {
      user_id: input.userId,
      turf_id: input.turfId,
      slot_id: input.slotId,
      players: input.players,
      total_price: totalPrice,
    });

    await client.query("commit");
    return booking;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function listBookingsService(input: {
  role: "admin" | "owner" | "customer";
  userId: string;
}) {
  if (input.role === "admin") return listBookingsForAdmin();
  if (input.role === "owner") return listBookingsForOwner(input.userId);
  return listBookingsForUser(input.userId);
}

