import { z } from "zod";
import { getTurfById } from "../models/turf.model";
import {
  createTimeSlot,
  setTimeSlotStatusOwned,
  type TimeSlotStatus,
} from "../models/timeslot.model";

export const CreateSlotSchema = z.object({
  start_time: z.string().min(1),
  end_time: z.string().min(1),
});

export async function createSlotService(input: {
  ownerId: string;
  turfId: string;
  start_time: string;
  end_time: string;
}) {
  const turf = await getTurfById(input.turfId);
  if (!turf) {
    const err = new Error("Turf not found");
    (err as any).status = 404;
    throw err;
  }
  if (turf.owner_id !== input.ownerId) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }

  return createTimeSlot({
    turf_id: input.turfId,
    start_time: input.start_time,
    end_time: input.end_time,
    status: "available",
  });
}

export async function updateSlotStatusService(input: {
  ownerId: string;
  slotId: string;
  status: TimeSlotStatus;
}) {
  const updated = await setTimeSlotStatusOwned({
    owner_id: input.ownerId,
    slot_id: input.slotId,
    status: input.status,
  });
  if (!updated) {
    const err = new Error("Slot not found or not owned by you");
    (err as any).status = 404;
    throw err;
  }
  return updated;
}

