import type { Request, Response } from "express";
import { sendOk } from "../utils/response";
import { listBookingsForUser, listBookingsForOwner, listAllBookings } from "../models/booking.model";
import { getTurfsByOwner, listTurfs } from "../models/turf.model";
import { getUserById, listUsers } from "../models/user.model";
import { getOwnerFinance, getFavorites, getNotifications } from "../services/extra.service";

export async function getCustomerDashboard(req: Request, res: Response) {
  const user = req.user!;
  const [userData, bookings, favorites, notifications] = await Promise.all([
    getUserById(user.id),
    listBookingsForUser(user.id),
    getFavorites(user.id),
    getNotifications(user.id),
  ]);
  return sendOk(res, { user: userData, bookings, favorites, notifications });
}

export async function getOwnerDashboard(req: Request, res: Response) {
  const user = req.user!;
  const [turfsOwned, bookings, finance] = await Promise.all([
    getTurfsByOwner(user.id),
    listBookingsForOwner(user.id),
    getOwnerFinance(user.id),
  ]);
  return sendOk(res, { turfsOwned, bookings, finance });
}

export async function getAdminDashboard(req: Request, res: Response) {
  const [users, turfs, bookings] = await Promise.all([
    listUsers(),
    listTurfs({ limit: 100 }),
    listAllBookings(20),
  ]);
  return sendOk(res, {
    totalUsers: users.length,
    totalTurfs: turfs.length,
    totalBookings: bookings.length,
    recentBookings: bookings,
    recentUsers: users.slice(0, 10),
  });
}
