import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "../config/db";

type MigrationRow = { name: string; run_at: string };

async function ensureMigrationsTable() {
  await pool.query(`
    create table if not exists schema_migrations (
      name text primary key,
      run_at timestamptz not null default now()
    )
  `);
}

async function getRanMigrations(): Promise<Set<string>> {
  const res = await pool.query<MigrationRow>(
    `select name, run_at from schema_migrations order by name asc`,
  );
  return new Set(res.rows.map((r) => r.name));
}

async function runMigration(name: string, sql: string) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(sql);
    await client.query(`insert into schema_migrations(name) values ($1)`, [
      name,
    ]);
    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  await ensureMigrationsTable();
  const ran = await getRanMigrations();

  const migrationsDir = path.resolve(__dirname, "../../migrations");
  const entries = await fs.readdir(migrationsDir);
  const migrationFiles = entries
    .filter((f) => /^\d+_.+\.sql$/.test(f))
    .sort((a, b) => a.localeCompare(b));

  let applied = 0;
  for (const file of migrationFiles) {
    if (ran.has(file)) continue;
    const fullPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(fullPath, "utf8");
    console.log(`Applying migration: ${file}`);
    await runMigration(file, sql);
    applied += 1;
  }

  console.log(`Migrations complete. Applied: ${applied}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

