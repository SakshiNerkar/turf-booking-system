import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createSlotService, updateSlotStatusService } from "../services/slot.service";

export async function createSlot(req: Request, res: Response) {
  const user = req.user!;
  const { id: turfId } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = z
    .object({ start_time: z.string().min(1), end_time: z.string().min(1) })
    .parse(req.body);

  const slot = await createSlotService({
    ownerId: user.id,
    turfId,
    start_time: body.start_time,
    end_time: body.end_time,
  });
  return sendOk(res, slot, 201);
}

export async function updateSlotStatus(req: Request, res: Response) {
  const user = req.user!;
  const { id: slotId } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = z
    .object({ status: z.enum(["available", "blocked"]) })
    .parse(req.body);

  const slot = await updateSlotStatusService({
    ownerId: user.id,
    slotId,
    status: body.status,
  });
  return sendOk(res, slot);
}

