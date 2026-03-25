import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createBookingService } from "../services/booking.service";
import { listBookingsForUser, listBookingsForOwner, updateBookingStatus } from "../models/booking.model";

const CreateBookingSchema = z.object({
  turf_id: z.string().uuid(),
  date: z.string(), // YYYY-MM-DD
  start_time: z.string(), // HH:MM
  end_time: z.string(), // HH:MM
});

export async function createBooking(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateBookingSchema.parse(req.body);
  const booking = await createBookingService({
    userId: user.id,
    turfId: body.turf_id,
    date: body.date,
    startTime: body.start_time,
    endTime: body.end_time
  });
  return sendOk(res, booking, 201);
}

export async function listUserBookings(req: Request, res: Response) {
  const user = req.user!;
  const bookings = await listBookingsForUser(user.id);
  return sendOk(res, bookings);
}

export async function listOwnerBookings(req: Request, res: Response) {
  const user = req.user!;
  const bookings = await listBookingsForOwner(user.id);
  return sendOk(res, bookings);
}

export async function cancelBooking(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await updateBookingStatus(id, "cancelled");
  return sendOk(res, { success: true });
}
