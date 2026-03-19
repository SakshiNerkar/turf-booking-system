import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import {
  adminListBookings,
  adminListTurfs,
  adminListUsers,
  adminDeactivateTurfService,
  adminRevenueSummary,
} from "../services/admin.service";
import { adminBanUser, adminDeleteUser } from "../services/extra.service";

export async function listAdminTurfs(_req: Request, res: Response) {
  const turfs = await adminListTurfs();
  return sendOk(res, turfs);
}

export async function listAdminBookings(_req: Request, res: Response) {
  const bookings = await adminListBookings();
  return sendOk(res, bookings);
}

export async function adminRevenue(req: Request, res: Response) {
  const q = z.object({ from: z.string().optional(), to: z.string().optional() }).parse(req.query);
  const revenue = await adminRevenueSummary(q);
  return sendOk(res, revenue);
}

export async function listAdminUsers(_req: Request, res: Response) {
  const users = await adminListUsers();
  return sendOk(res, users);
}

export async function adminDeactivateTurf(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const turf = await adminDeactivateTurfService(id);
  return sendOk(res, turf);
}

export async function adminBanUserCtrl(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const result = await adminBanUser(id);
  return sendOk(res, result);
}

export async function adminDeleteUserCtrl(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const result = await adminDeleteUser(id);
  return sendOk(res, result);
}
