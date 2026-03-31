import { pool } from "./db";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT = 10;
async function hash(pw: string) { return bcrypt.hash(pw, SALT); }

const AMENITIES = ["Parking", "Changing Room", "Drinking Water", "First Aid", "CCTV", "Floodlights", "Cafeteria", "Locker Room"];

const SPORT_IMAGES: Record<string, string[]> = {
  "Football": [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?auto=format&fit=crop&q=80&w=800"
  ],
  "Cricket": [
    "https://images.unsplash.com/photo-1531415080294-467be7262875?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1599474924187-334a493630f8?auto=format&fit=crop&q=80&w=800"
  ],
  "Badminton": [
    "https://images.unsplash.com/photo-1626225967045-9c76db7a22e8?auto=format&fit=crop&q=80&w=800"
  ]
};

const REAL_TURFS = [
  { "name": "Lucky Sports Hub", "city": "Mumbai", "area": "Chandivali", "sport": "Football", "lat": 19.1086, "lng": 72.8954 },
  { "name": "V4 Sports Arena", "city": "Mumbai", "area": "Bhandup", "sport": "Football", "lat": 19.1412, "lng": 72.9351 },
  { "name": "One Shot Turf", "city": "Mumbai", "area": "Goregaon", "sport": "Football", "lat": 19.1663, "lng": 72.8550 },
  { "name": "Players Turf", "city": "Mumbai", "area": "Andheri East", "sport": "Cricket", "lat": 19.1155, "lng": 72.8712 },
  { "name": "Force Playing Fields", "city": "Mumbai", "area": "Dahisar", "sport": "Football", "lat": 19.2486, "lng": 72.8594 },
  { "name": "KICK", "city": "Mumbai", "area": "Andheri West", "sport": "Football", "lat": 19.1314, "lng": 72.8251 },
  { "name": "Urban Sports", "city": "Mumbai", "area": "Wadala", "sport": "Football", "lat": 19.0212, "lng": 72.8722 },
  { "name": "Astro Park", "city": "Mumbai", "area": "Worli", "sport": "Football", "lat": 19.0178, "lng": 72.8155 },
  { "name": "Dream Grounds", "city": "Mumbai", "area": "Malad", "sport": "Cricket", "lat": 19.1861, "lng": 72.8486 },
  { "name": "The Turf", "city": "Mumbai", "area": "Bandra", "sport": "Football", "lat": 19.0596, "lng": 72.8295 },
  { "name": "Aurix Multi-Sports Turf", "city": "Pune", "area": "Nande", "sport": "Football", "lat": 18.5712, "lng": 73.7431 },
  { "name": "Prime Sports Turf", "city": "Pune", "area": "Kharadi", "sport": "Football", "lat": 18.5516, "lng": 73.9312 },
  { "name": "Turf Up", "city": "Pune", "area": "Kharadi", "sport": "Cricket", "lat": 18.5528, "lng": 73.9455 },
  { "name": "Turf 9 Arena", "city": "Pune", "area": "Hadapsar", "sport": "Football", "lat": 18.5089, "lng": 73.9259 },
  { "name": "Pifa Football Academy", "city": "Pune", "area": "Wakad", "sport": "Football", "lat": 18.5996, "lng": 73.7686 },
  { "name": "Legend Sports Club", "city": "Pune", "area": "Mundhwa", "sport": "Cricket", "lat": 18.5367, "lng": 73.9155 },
  { "name": "Life Republic Turf", "city": "Pune", "area": "Hinjewadi", "sport": "Football", "lat": 18.6012, "lng": 73.7259 },
  { "name": "Futsal Station", "city": "Pune", "area": "Koregaon Park", "sport": "Football", "lat": 18.5361, "lng": 73.8931 },
  { "name": "Goal Squad", "city": "Pune", "area": "Bibwewadi", "sport": "Football", "lat": 18.4686, "lng": 73.8655 },
  { "name": "HotFut", "city": "Pune", "area": "Koregaon Park", "sport": "Football", "lat": 18.5412, "lng": 73.9059 }
];

export async function megaSeed() {
  console.log("🚀 Initializing Mega-Induction Sequence...");

  // 1. Wipe Registry
  await pool.query("TRUNCATE users, owner_profiles, owner_finance, turfs, turf_images, bookings, favorites, notifications, reviews RESTART IDENTITY CASCADE");

  const adminPassword = await hash("admin123");
  const ownerPassword = await hash("Owner@123");
  const userPassword = await hash("User@123");

  // 2. Admin Node
  await pool.query(`
    INSERT INTO users (name, email, phone, password, role, is_active, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, ["System Admin", "admin@turff.com", "+91-00000-00000", adminPassword, "admin", true, true]);

  // 3. Owners & Profiles
  const owners: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const res = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, [`Owner ${i}`, `owner${i}@gmail.com`, `+91-98765-0000${i}`, ownerPassword, 'owner']);
    const ownerId = res.rows[0].id;
    owners.push(ownerId);

    // Profile & Finance
    await pool.query(`
      INSERT INTO owner_profiles (user_id, business_name, total_earnings, rating, total_reviews)
      VALUES ($1, $2, $3, $4, $5)
    `, [ownerId, `Business ${i} Arena Group`, Math.random() * 50000, 4.5, 20]);

    await pool.query(`
      INSERT INTO owner_finance (owner_id, total_earnings, monthly_earnings)
      VALUES ($1, $2, $3)
    `, [ownerId, 100000, 25000]);
  }

  // 4. Turfs & Images
  for (let i = 0; i < REAL_TURFS.length; i++) {
    const t = REAL_TURFS[i]!;
    const ownerId = owners[i % owners.length];
    const price_weekday = Math.floor(Math.random() * (2000 - 1000) + 1000);
    const price_weekend = price_weekday + 500;
    
    const turfRes = await pool.query(`
      INSERT INTO turfs (
        owner_id, name, description, location_city, location_address, latitude, longitude,
        sports_available, amenities, price_weekday, price_weekend, rating, total_reviews
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id
    `, [
      ownerId, t.name, `Top class ${t.sport} facility in ${t.area}.`, t.city, 
      `${t.area}, ${t.city}`, t.lat, t.lng, t.sport, JSON.stringify(AMENITIES.slice(0, 4)),
      price_weekday, price_weekend, 4.2 + (Math.random() * 0.8), 20 + Math.floor(Math.random() * 50)
    ]);
    const turfId = turfRes.rows[0].id;

    // Primary Image
    const sportsImgs = SPORT_IMAGES[t.sport] || SPORT_IMAGES["Football"]!;
    await pool.query(`
      INSERT INTO turf_images (turf_id, image_url, is_primary)
      VALUES ($1, $2, true)
    `, [turfId, sportsImgs[0]]);
  }

  // 5. Test Athlete
  const userRes = await pool.query(`
    INSERT INTO users (name, email, phone, password, role)
    VALUES ($1, $2, $3, $4, 'user') RETURNING id
  `, ["Athlete Anant", "anant12@gmail.com", "+91-1234567890", userPassword]);
  const userId = userRes.rows[0].id;

  console.log("✅ Mega-Seed Complete.");
}
