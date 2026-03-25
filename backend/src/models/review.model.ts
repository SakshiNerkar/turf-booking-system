import { pool } from "../config/db";

export type ReviewRow = {
  id: string;
  user_id: string;
  turf_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export async function createReview(input: Omit<ReviewRow, "id" | "created_at">) {
  const res = await pool.query<ReviewRow>(
    `
    insert into reviews(user_id, turf_id, rating, comment)
    values ($1, $2, $3, $4)
    returning *
  `,
    [input.user_id, input.turf_id, input.rating, input.comment],
  );
  return res.rows[0]!;
}

export async function getReviewsByTurf(turfId: string) {
  const res = await pool.query<ReviewRow & { user_name: string }>(
    `
    select r.*, u.name as user_name
    from reviews r
    join users u on r.user_id = u.id
    where r.turf_id = $1
    order by r.created_at desc
  `,
    [turfId],
  );
  return res.rows;
}
