import type { Request, Response } from "express";
import { z } from "zod";
import { sendOk } from "../utils/response";
import { createPaymentService, type PaymentMethod } from "../services/payment.service";

const CreatePaymentSchema = z.object({
  booking_id: z.string().uuid(),
  payment_method: z.enum(["UPI", "Card", "Cash", "NetBanking", "Wallet"]),
});

export async function createPayment(req: Request, res: Response) {
  const user = req.user!;
  const body = CreatePaymentSchema.parse(req.body);

  const result = await createPaymentService({
    bookingId: body.booking_id,
    userId: user.id,
    payment_method: body.payment_method as PaymentMethod,
  });

  return sendOk(res, result, 201);
}
