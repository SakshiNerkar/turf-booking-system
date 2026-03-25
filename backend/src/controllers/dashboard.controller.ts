import type { Request, Response } from "express";
import { sendOk } from "../utils/response";
import { listBookingsForUser, listBookingsForOwner } from "../models/booking.model";
import { getTurfsByOwner, listTurfs } from "../models/turf.model";
import { getUserById, listUsers } from "../models/user.model";

export async function getCustomerDashboard(req: Request, res: Response) {
  const user = req.user!;
  const [userData, bookings] = await Promise.all([
    getUserById(user.id),
    listBookingsForUser(user.id)
  ]);

  return sendOk(res, {
    favorites: JSON.parse(userData?.favorites || '[]'),
    bookings
  });
}

export async function getOwnerDashboard(req: Request, res: Response) {
  const user = req.user!;
  const [userData, turfsOwned, bookings] = await Promise.all([
    getUserById(user.id),
    getTurfsByOwner(user.id),
    listBookingsForOwner(user.id)
  ]);

  return sendOk(res, {
    turfsOwned,
    earnings: {
      total: userData?.earnings_total || 0,
      monthly: userData?.earnings_monthly || 0
    },
    bookings
  });
}

export async function getAdminDashboard(req: Request, res: Response) {
  const [users, turfs, bookings] = await Promise.all([
    listUsers(),
    listTurfs(),
    // We'll assume a generic listBookings exists or use admin service
    [] // Placeholder for total bookings
  ]);

  return sendOk(res, {
    totalUsers: users.length,
    totalTurfs: turfs.length,
    totalBookings: 0 // Placeholder
  });
}
