import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { addReviewService, getTurfReviewsService } from "../services/review.service";

const CreateReviewSchema = z.object({
  turf_id: z.string().uuid(),
  booking_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function addReview(req: Request, res: Response) {
  const user = req.user!;
  const body = CreateReviewSchema.parse(req.body);
  const review = await addReviewService(user.id, {
    turfId: body.turf_id,
    bookingId: body.booking_id,
    rating: body.rating,
    comment: body.comment,
  });
  return sendOk(res, review, 201);
}

export async function getTurfReviews(req: Request, res: Response) {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const reviews = await getTurfReviewsService(id);
  return sendOk(res, reviews);
}
