/**
 * SQLite adapter that mimics the `pg` Pool interface.
 *
 * PostgreSQL → SQLite compatibility:
 *   $1..$N params      → ? params (reordered)
 *   gen_random_uuid()  → injected UUIDs (pre-query)
 *   now()              → datetime('now')
 *   current_date       → date('now')
 *   ilike              → like
 *   ::type casts       → stripped
 *   RETURNING *        → re-fetched by id after mutating query
 *   true/false         → 1/0
 *   is_active boolean  → normalised back to JS boolean on read
 */

import Database, { type Database as DB } from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

const DB_PATH = path.resolve(__dirname, "../../turff.sqlite");

export const sqliteDb: DB = new Database(DB_PATH);

sqliteDb.pragma("journal_mode = WAL");
sqliteDb.pragma("foreign_keys = ON");

// ─── Schema init (idempotent) ─────────────────────────────────────────────────
function initSchema() {
  const exists = sqliteDb
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    .get();
  if (exists) return;

  console.log("🗄️  Initialising SQLite schema…");
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      phone TEXT, password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('admin','owner','customer')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS turfs (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL, location TEXT NOT NULL, sport_type TEXT NOT NULL,
      price_per_slot REAL NOT NULL, description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_turfs_owner      ON turfs(owner_id);
    CREATE INDEX IF NOT EXISTS idx_turfs_location   ON turfs(location);
    CREATE INDEX IF NOT EXISTS idx_turfs_sport_type ON turfs(sport_type);
    CREATE TABLE IF NOT EXISTS time_slots (
      id TEXT PRIMARY KEY, turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      start_time TEXT NOT NULL, end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available','booked','blocked')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(turf_id, start_time, end_time), CHECK(end_time > start_time)
    );
    CREATE INDEX IF NOT EXISTS idx_time_slots_turf  ON time_slots(turf_id);
    CREATE INDEX IF NOT EXISTS idx_time_slots_start ON time_slots(start_time);
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      slot_id TEXT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
      players INTEGER NOT NULL CHECK(players > 0),
      total_price REAL NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','success','failed')),
      booking_date TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(slot_id)
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_turf ON bookings(turf_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      payment_type TEXT NOT NULL CHECK(payment_type IN ('online','offline')),
      payment_status TEXT NOT NULL CHECK(payment_status IN ('pending','success','failed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(booking_id)
    );
    CREATE TABLE IF NOT EXISTS revenue (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      date TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_revenue_owner ON revenue(owner_id);
    CREATE INDEX IF NOT EXISTS idx_revenue_turf  ON revenue(turf_id);
    CREATE INDEX IF NOT EXISTS idx_revenue_date  ON revenue(date);
  `);
  console.log("✅ SQLite schema ready.");
}

// ─── SQL translator ────────────────────────────────────────────────────────────
function translateSQL(sql: string): string {
  return sql
    .replace(/\$(\d+)/g, "?")                              // $1 → ?
    .replace(/gen_random_uuid\(\)/gi, "?")                  // injected (UUIDs prepended)
    .replace(/\bnow\(\)/gi, "datetime('now')")
    .replace(/\bcurrent_date\b/gi, "date('now')")
    .replace(/CURRENT_DATE\b/g, "date('now')")
    .replace(/- INTERVAL '[^']+'/gi, "")                    // strip INTERVAL
    .replace(/::[a-zA-Z_][\w().]*/g, "")                   // ::type casts
    .replace(/\bilike\b/gi, "like")
    .replace(/\breturning\s+\*/gi, "")                      // strip RETURNING
    .replace(/\btrue\b/g, "1").replace(/\bfalse\b/g, "0")
    .trim();
}

// ─── Normalise row (booleans, numbers) ───────────────────────────────────────
function norm(row: any): any {
  if (!row) return row;
  const out: any = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === "is_active") out[k] = v === 1 || v === true;
    else out[k] = v;
  }
  return out;
}

// ─── Extract first UUID-looking param value for RETURNING re-fetch ────────────
function extractIdParam(params: any[]): string | null {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return params.find((p) => typeof p === "string" && uuidRe.test(p)) ?? null;
}

// ─── Core executor ────────────────────────────────────────────────────────────
function execSQL<T = any>(rawSql: string, rawParams: any[] = []): { rows: T[] } {
  const low = rawSql.trim().toLowerCase();

  // Transaction control
  if (low === "begin")    { sqliteDb.prepare("BEGIN").run();    return { rows: [] }; }
  if (low === "commit")   { sqliteDb.prepare("COMMIT").run();   return { rows: [] }; }
  if (low === "rollback") { sqliteDb.prepare("ROLLBACK").run(); return { rows: [] }; }
  if (low.startsWith("select 1")) {
    return { rows: [{ "?column?": 1 } as any] };
  }

  // Count gen_random_uuid() occurrences and prepend injected UUIDs
  const uuidCount = (rawSql.match(/gen_random_uuid\(\)/gi) || []).length;
  const injectedUUIDs = Array.from({ length: uuidCount }, () => randomUUID());
  const params = [...injectedUUIDs, ...rawParams];

  const sql = translateSQL(rawSql);
  const hasReturning = /\breturning\s+\*/i.test(rawSql);

  // ── Detect table name ────────────────────────────────────────────────────
  const tableMatch = rawSql.match(/^\s*(?:insert\s+into|update|delete\s+from)\s+(\w+)/i);
  const table = tableMatch ? tableMatch[1] : null;

  try {
    // SELECT
    if (low.startsWith("select") || low.startsWith("with")) {
      const rows = sqliteDb.prepare(sql).all(...params) as any[];
      return { rows: rows.map(norm) as T[] };
    }

    // INSERT / UPDATE / DELETE
    const stmt = sqliteDb.prepare(sql);
    stmt.run(...params);

    if (hasReturning && table) {
      // For INSERT: first injected UUID is the PK
      if (low.startsWith("insert") && injectedUUIDs[0]) {
        const row = sqliteDb.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(injectedUUIDs[0]);
        return { rows: row ? [norm(row) as T] : [] };
      }
      // For UPDATE/DELETE: scan raw params for a UUID that matches id column
      const idVal = extractIdParam(rawParams);
      if (idVal) {
        const row = sqliteDb.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(idVal);
        if (row) return { rows: [norm(row) as T] };
      }
      // Fallback: return last row in table (best-effort)
      const row = sqliteDb.prepare(`SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 1`).get();
      return { rows: row ? [norm(row) as T] : [] };
    }

    return { rows: [] };
  } catch (err: any) {
    if (err?.message?.includes("UNIQUE constraint failed")) {
      err.code = "23505";
      err.constraint = err.message.replace("UNIQUE constraint failed: ", "");
    }
    throw err;
  }
}

// ─── Exported pool (matches pg Pool API) ─────────────────────────────────────
export const pool = {
  query: <T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> => {
    return Promise.resolve(execSQL<T>(sql, params ?? []));
  },

  connect: async () => {
    return {
      query: <T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> => {
        return Promise.resolve(execSQL<T>(sql, params ?? []));
      },
      release: () => {},
    };
  },

  end: async () => { sqliteDb.close(); },
};

// Init on import
initSchema();
