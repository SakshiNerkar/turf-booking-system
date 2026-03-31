import type { Express } from "express";
import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { bookingRouter } from "./booking.routes";
import { dashboardRouter } from "./dashboard.routes";
import { reviewRouter } from "./review.routes";
import { turfRouter } from "./turf.routes";
import { uploadRouter } from "./upload.routes";

export function mountRoutes(app: Express) {
  const router = Router();

  router.get("/health", (_req, res) => res.json({ ok: true, version: "2.0.0", schema: "production-grade" }));

  router.use("/auth",       authRouter);
  router.use("/turfs",      turfRouter);
  router.use("/bookings",   bookingRouter);
  router.use("/dashboards", dashboardRouter);
  router.use("/reviews",    reviewRouter);
  router.use("/admin",      adminRouter);
  router.use("/upload",     uploadRouter);

  app.use("/api", router);
}
