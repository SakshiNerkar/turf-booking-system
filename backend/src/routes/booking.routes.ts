import { Router } from "express";
import {
  createBooking, listUserBookings, listOwnerBookings,
  cancelBooking, completeBooking, getBooking
} from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const bookingRouter = Router();

// User routes
bookingRouter.post("/",          requireAuth, requireRole(["user"]),  (req, res, next) => createBooking(req, res).catch(next));
bookingRouter.get("/my",         requireAuth, requireRole(["user"]),  (req, res, next) => listUserBookings(req, res).catch(next));
bookingRouter.put("/:id/cancel", requireAuth,                         (req, res, next) => cancelBooking(req, res).catch(next));

// Owner routes
bookingRouter.get("/owner",            requireAuth, requireRole(["owner"]),        (req, res, next) => listOwnerBookings(req, res).catch(next));
bookingRouter.put("/:id/complete",     requireAuth, requireRole(["owner", "admin"]),(req, res, next) => completeBooking(req, res).catch(next));

// Anyone authenticated can view a single booking
bookingRouter.get("/:id", requireAuth, (req, res, next) => getBooking(req, res).catch(next));
