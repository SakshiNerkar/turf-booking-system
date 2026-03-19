import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import {
  createTurfService,
  deleteTurfService,
  getTurfDetailsService,
  listTurfsService,
  updateTurfService,
} from "../services/turf.service";

const CreateTurfSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  sport_type: z.string().min(2),
  price_per_slot: z.coerce.number().positive(),
  description: z.string().optional(),
});

const UpdateTurfSchema = CreateTurfSchema.partial().extend({
  description: z.string().nullable().optional(),
});

const TurfDetailsQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export async function listTurfs(req: Request, res: Response) {
  const turfs = await listTurfsService(req.query);
  return sendOk(res, turfs);
}

export async function getTurf(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const q = TurfDetailsQuery.parse(req.query);
  const result = await getTurfDetailsService(id, q);
  return sendOk(res, result);
}

export async function createTurf(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateTurfSchema.parse(req.body);
  const turf = await createTurfService(user.id, body);
  return sendOk(res, turf, 201);
}

export async function updateTurf(req: Request, res: Response) {
  const user = req.user!;
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = UpdateTurfSchema.parse(req.body);
  const turf = await updateTurfService(user.id, id, body);
  return sendOk(res, turf);
}

export async function deleteTurf(req: Request, res: Response) {
  const user = req.user!;
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const turf = await deleteTurfService(user.id, id);
  return sendOk(res, turf);
}

