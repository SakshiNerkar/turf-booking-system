import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getAdminDashboard, getCustomerDashboard, getOwnerDashboard } from "../controllers/dashboard.controller";
import { requireRole } from "../middleware/role.middleware";

export const dashboardRouter = Router();

dashboardRouter.get("/user", requireAuth, requireRole(["user"]), (req, res, next) => {
  getCustomerDashboard(req, res).catch(next);
});

dashboardRouter.get("/owner", requireAuth, requireRole(["owner"]), (req, res, next) => {
  getOwnerDashboard(req, res).catch(next);
});

dashboardRouter.get("/admin", requireAuth, requireRole(["admin"]), (req, res, next) => {
  getAdminDashboard(req, res).catch(next);
});
