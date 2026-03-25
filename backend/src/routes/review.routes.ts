import { Router } from "express";
import { addReview, getTurfReviews } from "../controllers/review.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

export const reviewRouter = Router();

reviewRouter.get("/turf/:id", (req, res, next) => {
  getTurfReviews(req, res).catch(next);
});

reviewRouter.post("/", requireAuth, requireRole(["user"]), (req, res, next) => {
  addReview(req, res).catch(next);
});
