import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createBookingService } from "../services/turf.service";
import { listBookingsForUser, listBookingsForOwner, updateBookingStatus, getBookingById } from "../models/booking.model";
import { cancelBookingService } from "../services/extra.service";

const CreateBookingSchema = z.object({
  turf_id: z.string().uuid(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
});

export async function createBooking(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateBookingSchema.parse(req.body);
  const booking = await createBookingService({
    userId: user.id,
    turfId: body.turf_id,
    bookingDate: body.booking_date,
    startTime: body.start_time,
    endTime: body.end_time,
  });
  return sendOk(res, booking, 201);
}

export async function listUserBookings(req: Request, res: Response) {
  const bookings = await listBookingsForUser(req.user!.id);
  return sendOk(res, bookings);
}

export async function listOwnerBookings(req: Request, res: Response) {
  const bookings = await listBookingsForOwner(req.user!.id);
  return sendOk(res, bookings);
}

export async function getBooking(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const booking = await getBookingById(id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  return sendOk(res, booking);
}

export async function cancelBooking(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const result = await cancelBookingService(id, req.user!.id);
  return sendOk(res, result);
}

export async function completeBooking(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await updateBookingStatus(id, "completed");
  return sendOk(res, { success: true });
}
