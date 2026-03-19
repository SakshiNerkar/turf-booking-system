import { createApp } from "./app";
import { pool } from "./config/db";
import { env } from "./config/env";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const USE_SQLITE =
  !env.DATABASE_URL ||
  env.DATABASE_URL.startsWith("postgresql://postgres:postgres@localhost") ||
  env.DATABASE_URL.startsWith("postgresql://localhost") ||
  env.DATABASE_URL === "postgresql://postgres:postgres@localhost:5432/turf_booking";

async function waitForDB() {
  if (USE_SQLITE) {
    // SQLite: already initialised synchronously in sqlite.db.ts
    console.log("✅ SQLite database ready (turff.sqlite)");
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await pool.query("select 1");
      console.log("✅ PostgreSQL connected successfully.");
      return;
    } catch (err: any) {
      console.warn(`⏳ DB not ready (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
      if (attempt === MAX_RETRIES) {
        console.error(
          `\n❌ Could not connect to PostgreSQL after ${MAX_RETRIES} attempts.`
        );
        console.error("💡 The server will still run. Fix DATABASE_URL in backend/.env");
        console.error("   Free options:");
        console.error("   • Neon (recommended): https://neon.tech");
        console.error("   • Supabase: https://supabase.com\n");
        return; // don't crash — keep HTTP server up
      }
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

async function main() {
  console.log("\n🚀 Starting Turff API server...");
  console.log(`📋 Environment: ${env.NODE_ENV}`);

  const app = createApp();

  // Start HTTP immediately
  const server = app.listen(env.PORT, () => {
    console.log(`\n🟢 API listening on http://localhost:${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health\n`);
  });

  await waitForDB();

  // Seed demo data (SQLite only — safe to call every start; it's idempotent)
  if (USE_SQLITE) {
    try {
      const { seedDemoData } = require("./config/seed");
      await seedDemoData();
    } catch (e: any) {
      console.warn("⚠️  Seeding skipped:", e.message);
    }
  }
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
