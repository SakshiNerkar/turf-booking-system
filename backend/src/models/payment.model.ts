import { pool, type PoolClient } from "../config/db";

export type PaymentType = "online" | "offline";
export type PaymentStatus = "pending" | "success" | "failed";

export type PaymentRow = {
  id: string;
  booking_id: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  created_at: string;
};

export async function createPayment(
  client: PoolClient,
  input: {
    booking_id: string;
    payment_type: PaymentType;
    payment_status: PaymentStatus;
  },
) {
  // SQLite compatible: INSERT OR REPLACE (upsert)
  const res = await client.query<PaymentRow>(
    `
    INSERT INTO payments(booking_id, payment_type, payment_status)
    VALUES ($1, $2, $3)
    ON CONFLICT(booking_id) DO UPDATE SET
      payment_type   = excluded.payment_type,
      payment_status = excluded.payment_status
    RETURNING *
    `,
    [input.booking_id, input.payment_type, input.payment_status],
  );

  if (res.rows[0]) return res.rows[0];

  // Fallback re-fetch if RETURNING not resolved
  const fetched = await pool.query<PaymentRow>(
    `SELECT * FROM payments WHERE booking_id = $1`,
    [input.booking_id],
  );
  return fetched.rows[0]!;
}
