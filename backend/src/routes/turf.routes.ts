import { Router } from "express";
import { listTurfs, getTurfSlots, createTurf, getOwnerTurfs, deleteTurf } from "../controllers/turf.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const turfRouter = Router();

turfRouter.get("/",          (req, res, next) => listTurfs(req, res).catch(next));
turfRouter.get("/my",        requireAuth, requireRole(["owner"]),  (req, res, next) => getOwnerTurfs(req, res).catch(next));
turfRouter.get("/:id",       (req, res, next) => getTurfSlots(req, res).catch(next));
turfRouter.post("/",         requireAuth, requireRole(["owner", "admin"]), (req, res, next) => createTurf(req, res).catch(next));
turfRouter.delete("/:id",    requireAuth, requireRole(["owner", "admin"]), (req, res, next) => deleteTurf(req, res).catch(next));
