import { Router } from "express";
import { createBooking, listUserBookings, listOwnerBookings, cancelBooking } from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const bookingRouter = Router();

bookingRouter.get("/user", requireAuth, requireRole(["user"]), (req, res, next) => {
  listUserBookings(req, res).catch(next);
});

bookingRouter.get("/owner", requireAuth, requireRole(["owner"]), (req, res, next) => {
  listOwnerBookings(req, res).catch(next);
});

bookingRouter.post("/", requireAuth, requireRole(["user"]), (req, res, next) => {
  createBooking(req, res).catch(next);
});

bookingRouter.put("/:id/cancel", requireAuth, (req, res, next) => {
  cancelBooking(req, res).catch(next);
});
