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

  const today = new Date().toISOString().split('T')[0]!;
  
  // Calculate Stats
  const upcomingBookings = bookings.filter(b => b.booking_date >= today && b.status === 'confirmed');
  
  const totalPlayTimeMinutes = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const [sh, sm] = b.start_time.split(':').map(Number);
      const [eh, em] = b.end_time.split(':').map(Number);
      const duration = (eh! * 60 + em!) - (sh! * 60 + sm!);
      return sum + Math.max(0, duration);
    }, 0);

  // Calendar for next 7 days
  const calendar: Record<string, any[]> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0]!;
    calendar[dateStr] = bookings.filter(b => b.booking_date === dateStr);
  }

  // Quick Book Again (last 3 unique turfs)
  const uniqueTurfs = new Map();
  bookings.forEach(b => {
    if (!uniqueTurfs.has(b.turf_id) && uniqueTurfs.size < 3) {
      uniqueTurfs.set(b.turf_id, {
        id: b.turf_id,
        name: b.turf_name,
        image: b.turf_image
      });
    }
  });

  return sendOk(res, { 
    user: userData, 
    bookings, 
    favorites, 
    notifications,
    stats: {
      upcomingMatches: upcomingBookings.length,
      totalPlayingHours: Math.round(totalPlayTimeMinutes / 60),
      walletBalance: 1500.00, // Dummy
      membership: "Field Masters Gold" // Dummy
    },
    calendar,
    quickBookAgain: Array.from(uniqueTurfs.values())
  });
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
    listAllBookings(100),
  ]);

  const owners = users.filter(u => u.role === 'owner');
  const today = new Date().toISOString().split('T')[0]!;
  const bookingsToday = bookings.filter(b => (b.created_at?.toString() || '').startsWith(today));
  
  // Calculate commission revenue (assuming 10% for now if not tracked in DB)
  const commissionRevenueToday = bookingsToday.reduce((sum, b) => sum + (Number(b.total_price) * 0.1), 0);
  
  // Growth Stats (Last week dummy for now)
  const ownersThisWeek = owners.length > 5 ? 8 : 0;
  const turfsThisWeek = turfs.length > 5 ? 15 : 0;

  // Trends
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStr = d.toISOString().split('T')[0]!;
    const dayBookings = bookings.filter(b => (b.created_at?.toString() || '').startsWith(dayStr));
    return {
      date: dayStr,
      bookings: dayBookings.length,
      revenue: dayBookings.reduce((sum, b) => sum + (Number(b.total_price) * 0.1), 0),
      registrations: users.filter(u => (u.created_at?.toString() || '').startsWith(dayStr) && u.role === 'owner').length
    };
  });

  return sendOk(res, {
    totalOwners: owners.length,
    totalTurfs: turfs.length,
    revenueToday: commissionRevenueToday,
    bookingsToday: bookingsToday.length,
    totalBookings: bookings.length,
    ownersThisWeek,
    turfsThisWeek,
    trends: last30Days,
    recentBookings: bookings.slice(0, 10),
    ownerApprovals: owners.slice(0, 5),
    allUsers: users.length,
  });
}
