import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createPaymentService } from "../services/payment.service";

const CreatePaymentSchema = z.object({
  booking_id: z.string().uuid(),
  payment_type: z.enum(["online", "offline"]),
  payment_status: z.enum(["pending", "success", "failed"]),
});

export async function createPayment(req: Request, res: Response) {
  const user = req.user!;
  const body = CreatePaymentSchema.parse(req.body);

  const result = await createPaymentService({
    bookingId: body.booking_id,
    userId: user.id,
    payment_type: body.payment_type,
    payment_status: body.payment_status,
  });

  return sendOk(res, result, 201);
}

