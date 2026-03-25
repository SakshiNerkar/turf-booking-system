import { z } from "zod";
import {
  createTurf,
  getTurfById,
  listTurfs,
  getTurfsByOwner,
  deleteTurf,
} from "../models/turf.model";
import { getBookingsByTurfAndDate } from "../models/booking.model";

export const ListTurfsQuerySchema = z.object({
  city: z.string().optional(),
  sport: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export async function listTurfsService(query: unknown) {
  const q = ListTurfsQuerySchema.parse(query);
  return listTurfs(q);
}

/**
 * DYNAMIC SLOT GENERATION LOGIC
 * Senior Backend Specification implementation
 */
export async function getTurfSlotsService(id: string, date: string) {
  const turf = await getTurfById(id);
  if (!turf) throw new Error("Turf not found");

  const bookings = await getBookingsByTurfAndDate(id, date);
  
  const slots = [];
  let current = turf.opening_time; // e.g. "06:00"
  const end = turf.closing_time; // e.g. "23:00"

  while (current < end) {
    const [h, m] = current.split(':').map(Number);
    const dateObj = new Date(2000, 0, 1, h, m);
    dateObj.setMinutes(dateObj.getMinutes() + turf.slot_duration);
    
    const nextH = String(dateObj.getHours()).padStart(2, '0');
    const nextM = String(dateObj.getMinutes()).padStart(2, '0');
    const next = `${nextH}:${nextM}`;

    if (next > end) break;

    const isBooked = bookings.some(b => 
      (current >= b.start_time && current < b.end_time) ||
      (next > b.start_time && next <= b.end_time)
    );

    slots.push({
      start_time: current,
      end_time: next,
      status: isBooked ? "booked" : "available"
    });

    current = next;
  }

  return { turf, slots };
}

export async function createTurfService(ownerId: string, input: any) {
  return createTurf({ owner_id: ownerId, ...input });
}

export async function deleteTurfService(ownerId: string, turfId: string) {
  const turf = await getTurfById(turfId);
  if (!turf || turf.owner_id !== ownerId) throw new Error("Unauthorized");
  await deleteTurf(turfId);
  return { success: true };
}
