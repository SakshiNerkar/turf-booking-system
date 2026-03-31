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

  console.log("🗄️  Initialising Senior Backend Schema…");
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, 
      name TEXT NOT NULL, 
      email TEXT NOT NULL UNIQUE,
      phone TEXT, 
      password TEXT NOT NULL,
      profile_image TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS turfs (
      id TEXT PRIMARY KEY, 
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL, 
      description TEXT,
      location_city TEXT NOT NULL,
      location_address TEXT NOT NULL,
      sports_available TEXT NOT NULL,
      amenities TEXT DEFAULT '[]',
      price_weekday REAL NOT NULL,
      price_weekend REAL NOT NULL,
      rating REAL DEFAULT 4.5,
      total_reviews INTEGER DEFAULT 0,
      opening_time TEXT NOT NULL,
      closing_time TEXT NOT NULL,
      slot_duration INTEGER DEFAULT 60,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS turf_images (
      id TEXT PRIMARY KEY,
      turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      turf_id TEXT NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_turfs_city       ON turfs(location_city);
    CREATE INDEX IF NOT EXISTS idx_turf_images_turf ON turf_images(turf_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_user    ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_owner   ON bookings(owner_id);
  `);
  console.log("✅ Platform Schema ready.");
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
