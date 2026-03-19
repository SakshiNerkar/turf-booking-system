import { pool } from "../config/db";
import { hashPassword } from "../utils/password";

async function upsertUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "owner" | "customer";
}) {
  const hashed = await hashPassword(input.password);
  const res = await pool.query<{ id: string }>(
    `
    insert into users(name, email, phone, password, role)
    values ($1, $2, $3, $4, $5)
    on conflict (email) do update set
      name = excluded.name,
      phone = excluded.phone,
      password = excluded.password,
      role = excluded.role,
      updated_at = now()
    returning id
  `,
    [input.name, input.email, input.phone ?? null, hashed, input.role],
  );
  return res.rows[0]!.id;
}

async function createDemoTurf(ownerId: string) {
  const res = await pool.query<{ id: string }>(
    `
    insert into turfs(owner_id, name, location, sport_type, price_per_slot, description)
    values ($1, $2, $3, $4, $5, $6)
    returning id
  `,
    [
      ownerId,
      "Green Arena Turf",
      "Sector 21",
      "football",
      1200,
      "Premium 5v5 football turf with lights and parking.",
    ],
  );
  return res.rows[0]!.id;
}

async function ensureTimeSlots(turfId: string) {
  // Generate slots for today: 6pm-10pm, 1 hour each
  await pool.query(
    `
    insert into time_slots(turf_id, start_time, end_time, status)
    values
      ($1, date_trunc('day', now()) + interval '18 hours', date_trunc('day', now()) + interval '19 hours', 'available'),
      ($1, date_trunc('day', now()) + interval '19 hours', date_trunc('day', now()) + interval '20 hours', 'available'),
      ($1, date_trunc('day', now()) + interval '20 hours', date_trunc('day', now()) + interval '21 hours', 'available'),
      ($1, date_trunc('day', now()) + interval '21 hours', date_trunc('day', now()) + interval '22 hours', 'available')
    on conflict (turf_id, start_time, end_time) do nothing
  `,
    [turfId],
  );
}

async function main() {
  const adminId = await upsertUser({
    name: "Admin",
    email: "admin@turff.local",
    phone: "9999999999",
    password: "Admin@123",
    role: "admin",
  });

  const ownerId = await upsertUser({
    name: "Owner One",
    email: "owner@turff.local",
    phone: "8888888888",
    password: "Owner@123",
    role: "owner",
  });

  const customerId = await upsertUser({
    name: "Customer One",
    email: "customer@turff.local",
    phone: "7777777777",
    password: "Customer@123",
    role: "customer",
  });

  const turfId = await createDemoTurf(ownerId);
  await ensureTimeSlots(turfId);

  console.log("Seed complete:", { adminId, ownerId, customerId, turfId });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

