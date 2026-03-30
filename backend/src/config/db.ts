/**
 * Typed pool interface — matches both pg.Pool and our SQLite adapter.
 * All models use pool.query<T>(sql, params) — this satisfies TypeScript.
 */

import { env } from "./env";

export interface PoolClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
  release(): void;
}

export interface DbPool {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
  connect(): Promise<PoolClient>;
  end(): Promise<void>;
}

// Detect whether to use PostgreSQL or SQLite
// Explicitly use SQLite only if the env is missing
const USE_SQLITE = !env.DATABASE_URL;

let _pool: DbPool;

if (USE_SQLITE) {
  console.log("🗄️  Using SQLite (no PostgreSQL configured). DB: turff.sqlite");
  const sqliteModule = require("./sqlite.db");
  _pool = sqliteModule.pool as DbPool;
} else {
  console.log("🐘 Using PostgreSQL:", env.DATABASE_URL.replace(/:([^:@]+)@/, ":***@"));
  const { Pool } = require("pg");
  _pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl:
      env.DATABASE_URL.includes("sslmode=require") ||
      env.DATABASE_URL.includes("neon.tech") ||
      env.DATABASE_URL.includes("supabase")
        ? { rejectUnauthorized: false }
        : false,
  }) as DbPool;
}

export const pool: DbPool = _pool;

export async function dbHealthcheck() {
  try {
    await pool.query("select 1");
    return true;
  } catch {
    return false;
  }
}
