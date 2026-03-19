import { z } from "zod";
import {
  createTurf,
  deactivateTurf,
  getTurfById,
  listTurfs,
  updateTurf,
} from "../models/turf.model";
import { listTimeSlotsByTurfId } from "../models/timeslot.model";

export const ListTurfsQuerySchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  sport_type: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function listTurfsService(query: unknown) {
  const q = ListTurfsQuerySchema.parse(query);
  return listTurfs({
    q: q.q,
    location: q.location,
    sport_type: q.sport_type,
    owner_id: q.owner_id,
    min_price: q.min_price,
    max_price: q.max_price,
    limit: q.limit,
    offset: q.offset,
  });
}

export async function getTurfDetailsService(id: string, opts?: {
  from?: string;
  to?: string;
}) {
  const turf = await getTurfById(id);
  if (!turf) {
    const err = new Error("Turf not found");
    (err as any).status = 404;
    throw err;
  }
  const slots = await listTimeSlotsByTurfId(id, opts);
  return { turf, slots };
}

export async function createTurfService(ownerId: string, input: {
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: number;
  description?: string;
}) {
  return createTurf({ owner_id: ownerId, ...input });
}

export async function updateTurfService(ownerId: string, turfId: string, patch: Partial<{
  name: string;
  location: string;
  sport_type: string;
  price_per_slot: number;
  description: string | null;
}>) {
  const updated = await updateTurf(turfId, ownerId, patch);
  if (!updated) {
    const err = new Error("Turf not found or not owned by you");
    (err as any).status = 404;
    throw err;
  }
  return updated;
}

export async function deleteTurfService(ownerId: string, turfId: string) {
  const deleted = await deactivateTurf(turfId, ownerId);
  if (!deleted) {
    const err = new Error("Turf not found or not owned by you");
    (err as any).status = 404;
    throw err;
  }
  return deleted;
}

