import { Router } from "express";
import {
  createBooking,
  listBookings,
  cancelBookingCtrl,
  ownerRevenueCtrl,
} from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const bookingRouter = Router();

bookingRouter.post("/", requireAuth, requireRole(["customer"]), (req, res, next) => {
  createBooking(req, res).catch(next);
});

bookingRouter.get("/", requireAuth, (req, res, next) => {
  listBookings(req, res).catch(next);
});

bookingRouter.delete("/:id", requireAuth, requireRole(["customer"]), (req, res, next) => {
  cancelBookingCtrl(req, res).catch(next);
});

bookingRouter.get("/revenue/owner", requireAuth, requireRole(["owner"]), (req, res, next) => {
  ownerRevenueCtrl(req, res).catch(next);
});
