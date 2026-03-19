import { Router } from "express";
import { createTurf, deleteTurf, getTurf, listTurfs, updateTurf } from "../controllers/turf.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const turfRouter = Router();

turfRouter.get("/", (req, res, next) => {
  listTurfs(req, res).catch(next);
});

turfRouter.get("/:id", (req, res, next) => {
  getTurf(req, res).catch(next);
});

turfRouter.post("/", requireAuth, requireRole(["owner"]), (req, res, next) => {
  createTurf(req, res).catch(next);
});

turfRouter.put("/:id", requireAuth, requireRole(["owner"]), (req, res, next) => {
  updateTurf(req, res).catch(next);
});

turfRouter.delete("/:id", requireAuth, requireRole(["owner"]), (req, res, next) => {
  deleteTurf(req, res).catch(next);
});

