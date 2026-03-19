/**
 * seed.ts — Inserts demo data into SQLite on first run.
 * Idempotent: checks if data exists before inserting.
 */

import { pool } from "./sqlite.db";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT = 10;

async function hash(pw: string) {
  return bcrypt.hash(pw, SALT);
}

export async function seedDemoData() {
  // Check if already seeded
  const existing = await pool.query("SELECT COUNT(*) as cnt FROM users");
  const count = Number((existing.rows[0] as any)?.cnt ?? 0);
  if (count > 0) return; // already seeded

  console.log("🌱 Seeding demo data...");

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminId    = randomUUID();
  const ownerId    = randomUUID();
  const owner2Id   = randomUUID();
  const customerId = randomUUID();
  const cust2Id    = randomUUID();

  const adminPw  = await hash("Admin@123");
  const ownerPw  = await hash("Owner@123");
  const custPw   = await hash("Customer@123");

  const db = (await import("./sqlite.db")).sqliteDb;

  db.prepare(`INSERT INTO users(id,name,email,phone,password,role) VALUES(?,?,?,?,?,?)`).run(
    adminId, "Admin User", "admin@turff.local", "+91-99999-00001", adminPw, "admin"
  );
  db.prepare(`INSERT INTO users(id,name,email,phone,password,role) VALUES(?,?,?,?,?,?)`).run(
    ownerId, "Rajesh Kumar", "owner@turff.local", "+91-98765-43210", ownerPw, "owner"
  );
  db.prepare(`INSERT INTO users(id,name,email,phone,password,role) VALUES(?,?,?,?,?,?)`).run(
    owner2Id, "Priya Sharma", "owner2@turff.local", "+91-91234-56789", ownerPw, "owner"
  );
  db.prepare(`INSERT INTO users(id,name,email,phone,password,role) VALUES(?,?,?,?,?,?)`).run(
    customerId, "Arjun Mehta", "customer@turff.local", "+91-87654-32109", custPw, "customer"
  );
  db.prepare(`INSERT INTO users(id,name,email,phone,password,role) VALUES(?,?,?,?,?,?)`).run(
    cust2Id, "Sneha Patel", "customer2@turff.local", "+91-76543-21098", custPw, "customer"
  );

  // ── Turfs ──────────────────────────────────────────────────────────────────
  const turf1 = randomUUID();
  const turf2 = randomUUID();
  const turf3 = randomUUID();
  const turf4 = randomUUID();
  const turf5 = randomUUID();
  const turf6 = randomUUID();

  const turfs = [
    [turf1, ownerId,  "Green Arena Football Ground",  "Koramangala, Bangalore",  "football",  1200, "FIFA-spec natural grass. Floodlights, changing rooms, parking."],
    [turf2, ownerId,  "Thunder Cricket Academy",      "Indiranagar, Bangalore",  "cricket",   1500, "22-yard turf pitch, nets, scoreboard. Suitable for T20 matches."],
    [turf3, owner2Id, "Sky Badminton Courts",         "HSR Layout, Bangalore",   "badminton",  800, "4 synthetic badminton courts, AC hall, pro equipment available."],
    [turf4, owner2Id, "Victory Tennis Club",          "Whitefield, Bangalore",   "tennis",    1000, "2 hard-surface courts, coaching available, well-lit for night play."],
    [turf5, ownerId,  "Power Football Stadium",        "JP Nagar, Bangalore",     "football",  1400, "Astroturf surface, 7-a-side, 5-a-side layouts. Pro-grade goals."],
    [turf6, owner2Id, "Premier Cricket Ground",        "Electronic City, Bangalore","cricket",  1600, "Premier turf with umpire platform, digital scoreboard, pavilion."],
  ];

  for (const [id, oid, name, loc, sport, price, desc] of turfs) {
    db.prepare(`INSERT INTO turfs(id,owner_id,name,location,sport_type,price_per_slot,description) VALUES(?,?,?,?,?,?,?)`).run(
      id, oid, name, loc, sport, price, desc
    );
  }

  // ── Time Slots (next 7 days, 6 AM–10 PM, 1-hour blocks) ─────────────────────
  const now = new Date();

  function generateSlots(turfId: string, daysAhead = 7) {
    const slots: string[] = [];
    for (let day = 0; day < daysAhead; day++) {
      for (let hour = 6; hour < 22; hour++) {
        const start = new Date(now);
        start.setDate(start.getDate() + day);
        start.setHours(hour, 0, 0, 0);

        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);

        const slotId = randomUUID();
        db.prepare(`INSERT OR IGNORE INTO time_slots(id,turf_id,start_time,end_time,status) VALUES(?,?,?,?,'available')`).run(
          slotId, turfId,
          start.toISOString(),
          end.toISOString()
        );
        slots.push(slotId);
      }
    }
    return slots;
  }

  const t1Slots = generateSlots(turf1);
  const t2Slots = generateSlots(turf2);
  const t3Slots = generateSlots(turf3);
  const t4Slots = generateSlots(turf4);
  generateSlots(turf5);
  generateSlots(turf6);

  // ── A couple of demo bookings ──────────────────────────────────────────────
  // Book slot[2] on turf1 for customer
  const bookingId1 = randomUUID();
  const bookSlot1 = t1Slots[2]; // 8 AM today
  if (bookSlot1) {
    db.prepare(`UPDATE time_slots SET status='booked' WHERE id=?`).run(bookSlot1);
    db.prepare(`INSERT INTO bookings(id,user_id,turf_id,slot_id,players,total_price,payment_status) VALUES(?,?,?,?,?,?,'success')`).run(
      bookingId1, customerId, turf1, bookSlot1, 10, 1200
    );
    // Record revenue
    const revenueId = randomUUID();
    db.prepare(`INSERT INTO revenue(id,owner_id,turf_id,amount) VALUES(?,?,?,?)`).run(
      revenueId, ownerId, turf1, 1200
    );
  }

  // Book slot[5] on turf2 for customer2
  const bookingId2 = randomUUID();
  const bookSlot2 = t2Slots[5];
  if (bookSlot2) {
    db.prepare(`UPDATE time_slots SET status='booked' WHERE id=?`).run(bookSlot2);
    db.prepare(`INSERT INTO bookings(id,user_id,turf_id,slot_id,players,total_price,payment_status) VALUES(?,?,?,?,?,?,'pending')`).run(
      bookingId2, cust2Id, turf2, bookSlot2, 22, 1500
    );
  }

  console.log(`✅ Seeded: 5 users, 6 turfs, slots for 7 days, 2 demo bookings`);
  console.log(`\n📋 Demo accounts:`);
  console.log(`   Admin:     admin@turff.local    / Admin@123`);
  console.log(`   Owner:     owner@turff.local    / Owner@123`);
  console.log(`   Customer:  customer@turff.local / Customer@123\n`);
}
