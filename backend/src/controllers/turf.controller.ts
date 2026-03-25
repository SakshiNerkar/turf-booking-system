import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { listTurfsService, getTurfSlotsService, createTurfService, deleteTurfService } from "../services/turf.service";
import { getTurfsByOwner } from "../models/turf.model";

const CreateTurfSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  location_city: z.string().min(2),
  location_address: z.string().min(5),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  sports_available: z.string().min(2),
  price_weekday: z.coerce.number().positive(),
  price_weekend: z.coerce.number().positive(),
  opening_time: z.string().regex(/^\d{2}:\d{2}$/),
  closing_time: z.string().regex(/^\d{2}:\d{2}$/),
  slot_duration: z.coerce.number().int().min(30).max(240),
});

export async function listTurfs(req: Request, res: Response) {
  const turfs = await listTurfsService(req.query);
  return sendOk(res, turfs);
}

export async function getTurfSlots(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const { date } = z.object({ date: z.string().optional() }).parse(req.query);
  const targetDate: string = date ?? new Date().toISOString().split("T")[0]!;
  const result = await getTurfSlotsService(id, targetDate);
  return sendOk(res, result);
}

export async function createTurf(req: Request, res: Response) {
  const body = CreateTurfSchema.parse(req.body);
  const turf = await createTurfService({ owner_id: req.user!.id, ...body });
  return sendOk(res, turf, 201);
}

export async function getOwnerTurfs(req: Request, res: Response) {
  const turfs = await getTurfsByOwner(req.user!.id);
  return sendOk(res, turfs);
}

export async function deleteTurf(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await deleteTurfService(id);
  return sendOk(res, { success: true });
}
