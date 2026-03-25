import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { addReviewService, getTurfReviewsService } from "../services/review.service";

const CreateReviewSchema = z.object({
  turfId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function addReview(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateReviewSchema.parse(req.body);
  const review = await addReviewService(user.id, body);
  return sendOk(res, review, 201);
}

export async function getTurfReviews(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const reviews = await getTurfReviewsService(id);
  return sendOk(res, reviews);
}
