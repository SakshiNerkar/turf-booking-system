import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { pool } from "./config/db";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { mountRoutes } from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // Enhanced health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      await pool.query("select 1");
      res.json({
        ok: true,
        status: "healthy",
        db: "connected",
        env: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(503).json({
        ok: false,
        status: "unhealthy",
        db: "disconnected",
        error: err.message,
        fix: "Set DATABASE_URL in backend/.env. Free options: https://neon.tech",
        timestamp: new Date().toISOString(),
      });
    }
  });

  mountRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
