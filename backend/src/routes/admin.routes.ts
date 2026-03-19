import { Router } from "express";
import {
  adminRevenue,
  adminDeactivateTurf,
  listAdminBookings,
  listAdminTurfs,
  listAdminUsers,
  adminBanUserCtrl,
  adminDeleteUserCtrl,
} from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["admin"]));

adminRouter.get("/turfs", (req, res, next) => {
  listAdminTurfs(req, res).catch(next);
});

adminRouter.get("/bookings", (req, res, next) => {
  listAdminBookings(req, res).catch(next);
});

adminRouter.get("/revenue", (req, res, next) => {
  adminRevenue(req, res).catch(next);
});

adminRouter.get("/users", (req, res, next) => {
  listAdminUsers(req, res).catch(next);
});

adminRouter.delete("/turfs/:id", (req, res, next) => {
  adminDeactivateTurf(req, res).catch(next);
});

adminRouter.patch("/users/:id/ban", (req, res, next) => {
  adminBanUserCtrl(req, res).catch(next);
});

adminRouter.delete("/users/:id", (req, res, next) => {
  adminDeleteUserCtrl(req, res).catch(next);
});
