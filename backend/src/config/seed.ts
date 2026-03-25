import { pool } from "./sqlite.db";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT = 10;
async function hash(pw: string) { return bcrypt.hash(pw, SALT); }

export async function seedDemoData() {
  const existing = await pool.query("SELECT COUNT(*) as cnt FROM users");
  if (Number((existing.rows[0] as any)?.cnt ?? 0) > 0) return;

  console.log("🌱 Seeding Senior Backend Demo Data...");

  const adminId = randomUUID();
  const ownerId = randomUUID();
  const userId  = randomUUID();

  const adminPw = await hash("Admin@123");
  const ownerPw = await hash("Owner@123");
  const userPw  = await hash("User@123");

  const db = (await import("./sqlite.db")).sqliteDb;

  db.prepare(`INSERT INTO users(id, name, email, phone, password, role) VALUES(?,?,?,?,?,?)`).run(
    adminId, "Admin Commander", "admin@turff.local", "+91-999-001", adminPw, "admin"
  );
  db.prepare(`INSERT INTO users(id, name, email, phone, password, role, earnings_total) VALUES(?,?,?,?,?,?,?)`).run(
    ownerId, "Rajesh Kumar", "owner@turff.local", "+91-888-002", ownerPw, "owner", 15000
  );
  db.prepare(`INSERT INTO users(id, name, email, phone, password, role) VALUES(?,?,?,?,?,?)`).run(
    userId, "Arjun Mehta", "user@turff.local", "+91-777-003", userPw, "user"
  );

  const turfs = [
    [randomUUID(), ownerId, "Elite Football Hub", "FIFA-spec grass. Pro lighting.", "Pune", "Hinjewadi Phase 2", '["https://images.unsplash.com/photo-1574629810360-7de62e1069ed"]', "football", '["Parking", "Water", "Lights"]', 1200, 1500, "06:00", "23:00", 60],
    [randomUUID(), ownerId, "Thunder Cricket Arena", "22-yard turf pitch. Digital scoreboard.", "Pune", "Wakad Bypass", '["https://images.unsplash.com/photo-1531415074968-036ba1b575da"]', "cricket", '["Net Practice", "Pavilion"]', 1500, 1800, "07:00", "22:00", 90]
  ];

  for (const t of turfs) {
    db.prepare(`
      INSERT INTO turfs(id, owner_id, name, description, location_city, location_address, images, sports_available, amenities, price_weekday, price_weekend, opening_time, closing_time, slot_duration)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(...t);
  }

  console.log(`✅ Platform Seeded: 3 Roles, 2 Regional Arenas.`);
}
