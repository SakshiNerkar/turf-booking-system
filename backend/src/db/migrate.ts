import fs from "fs";
import path from "path";
import { pool } from "../config/db";

async function runMigration() {
  console.log("🗄️  Starting Supabase Migration Sequence...");
  const sqlFile = path.resolve(__dirname, "../../migrations/001_init.sql");
  const sql = fs.readFileSync(sqlFile, "utf-8");

  try {
    const clients = await pool.connect();
    try {
      await clients.query(sql);
      console.log("✅ Supabase Registry Schema Defined Successfully.");
    } finally {
      clients.release();
    }
  } catch (err) {
    console.error("❌ Migration Protocol Failure:", err);
    process.exit(1);
  }
}

runMigration().then(() => process.exit(0));
