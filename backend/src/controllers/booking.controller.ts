import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createBookingService, listBookingsService } from "../services/booking.service";
import { cancelBookingService, ownerRevenueBreakdown } from "../services/extra.service";

const CreateBookingSchema = z.object({
  turf_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  players: z.coerce.number().int().positive().max(50),
});

export async function createBooking(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateBookingSchema.parse(req.body);
  const booking = await createBookingService({
    userId: user.id,
    turfId: body.turf_id,
    slotId: body.slot_id,
    players: body.players,
  });
  return sendOk(res, booking, 201);
}

export async function listBookings(req: Request, res: Response) {
  const user = req.user!;
  const bookings = await listBookingsService({ role: user.role, userId: user.id });
  return sendOk(res, bookings);
}

export async function cancelBookingCtrl(req: Request, res: Response) {
  const user = req.user!;
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const result = await cancelBookingService(id, user.id);
  return sendOk(res, result);
}

export async function ownerRevenueCtrl(req: Request, res: Response) {
  const user = req.user!;
  const data = await ownerRevenueBreakdown(user.id);
  return sendOk(res, data);
}
