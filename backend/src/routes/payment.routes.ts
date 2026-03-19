import { Router } from "express";
import { createPayment } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const paymentRouter = Router();

paymentRouter.post("/", requireAuth, requireRole(["customer"]), (req, res, next) => {
  createPayment(req, res).catch(next);
});

