import { z } from "zod";
import { createReview, getReviewsByTurf } from "../models/review.model";
import { updateTurfRating } from "../models/turf.model";

export async function addReviewService(userId: string, input: { turfId: string; rating: number; comment?: string }) {
  const review = await createReview({
    user_id: userId,
    turf_id: input.turfId,
    rating: input.rating,
    comment: input.comment ?? null,
  });

  // AUTOMATED RATING AGGREGATION
  await updateTurfRating(input.turfId);
  
  return review;
}

export async function getTurfReviewsService(turfId: string) {
  return getReviewsByTurf(turfId);
}
