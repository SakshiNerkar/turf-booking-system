import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import {
  createTurfService,
  deleteTurfService,
  getTurfSlotsService,
  listTurfsService,
} from "../services/turf.service";

const CreateTurfSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  location_city: z.string(),
  location_address: z.string(),
  images: z.string(),
  sports_available: z.string(),
  amenities: z.string(),
  price_weekday: z.coerce.number(),
  price_weekend: z.coerce.number(),
  opening_time: z.string(),
  closing_time: z.string(),
  slot_duration: z.coerce.number(),
});

export async function listTurfs(req: Request, res: Response) {
  const turfs = await listTurfsService(req.query);
  return sendOk(res, turfs);
}

export async function getTurfSlots(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const { date } = z.object({ date: z.string().optional() }).parse(req.query);
  
  const targetDate = date || new Date().toISOString().split('T')[0];
  const result = await getTurfSlotsService(id, targetDate);
  return sendOk(res, result);
}

export async function createTurf(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateTurfSchema.parse(req.body);
  const turf = await createTurfService(user.id, body);
  return sendOk(res, turf, 201);
}

export async function deleteTurf(req: Request, res: Response) {
  const user = req.user!;
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await deleteTurfService(user.id, id);
  return sendOk(res, { success: true });
}
