import type { Express } from "express";
import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { bookingRouter } from "./booking.routes";
import { paymentRouter } from "./payment.routes";
import { slotRouter } from "./slot.routes";
import { turfRouter } from "./turf.routes";

export function mountRoutes(app: Express) {
  const router = Router();

  router.get("/health", (_req, res) => res.json({ ok: true }));
  router.use("/auth", authRouter);
  router.use("/turfs", turfRouter);
  router.use("/bookings", bookingRouter);
  router.use("/payments", paymentRouter);
  router.use("/", slotRouter);
  router.use("/admin", adminRouter);

  app.use("/api", router);
}

