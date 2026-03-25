import type { Request, Response } from "express";
import { sendOk } from "../utils/response";

// Legacy slot controller — replaced by dynamic generation
export async function createSlot(_req: Request, res: Response) { return sendOk(res, { success: true }); }
export async function updateSlotStatus(_req: Request, res: Response) { return sendOk(res, { success: true }); }
