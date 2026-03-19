import { Router } from "express";
import { createSlot, updateSlotStatus } from "../controllers/slot.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const slotRouter = Router();

slotRouter.post(
  "/turfs/:id/slots",
  requireAuth,
  requireRole(["owner"]),
  (req, res, next) => {
    createSlot(req, res).catch(next);
  },
);

slotRouter.patch(
  "/slots/:id",
  requireAuth,
  requireRole(["owner"]),
  (req, res, next) => {
    updateSlotStatus(req, res).catch(next);
  },
);

