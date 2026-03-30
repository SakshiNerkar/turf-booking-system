import { pool } from "./db";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT = 10;
async function hash(pw: string) { return bcrypt.hash(pw, SALT); }

const CITIES = {
  "Mumbai": ["Bandra", "Andheri", "Borivali", "Juhu", "Powai", "Colaba", "Worli"],
  "Delhi": ["Hauz Khas", "Saket", "Dwarka", "Rohini", "Connaught Place", "Vasant Kunj"],
  "Bengaluru": ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Jayanagar", "Hebbal"],
  "Pune": ["Hinjewadi", "Wakad", "Baner", "Kothrud", "Viman Nagar", "Magarpatta"],
  "Chennai": ["Adyar", "T. Nagar", "Velachery", "Besant Nagar", "Anna Nagar"],
  "Hyderabad": ["Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills", "Kukatpally"],
  "Kolkata": ["Salt Lake", "New Town", "Park Street", "Ballygunge", "Dum Dum"],
  "Ahmedabad": ["Satellite", "Prahlad Nagar", "Navrangpura", "Bodakdev"],
  "Jaipur": ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C-Scheme"],
  "Chandigarh": ["Sector 17", "Sector 35", "Sector 7", "Manimajra"],
  "Gurgaon": ["DLF Phase 3", "Sector 56", "Cyber Hub", "Golf Course Road"],
  "Noida": ["Sector 18", "Sector 62", "Sector 15", "Greater Noida"]
};

const SPORTS = ["Football", "Cricket", "Badminton", "Tennis", "Pickleball", "Basketball"];
const AMENITIES = ["Parking", "Changing Room", "Drinking Water", "First Aid", "CCTV", "Floodlights", "Cafeteria", "Locker Room"];

const TURF_IMAGES = [
  "https://images.unsplash.com/photo-1574629810360-7de62e1069ed",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
  "https://images.unsplash.com/photo-1626245914530-4fd029314ca6",
  "https://images.unsplash.com/photo-1595435066311-66c39062e781",
  "https://images.unsplash.com/photo-1544919396-d135b0dc1b9d",
  "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc",
  "https://images.unsplash.com/photo-1599474924187-334a493630f8",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6"
];

export async function megaSeed() {
  console.log("🚀 Initializing Mega-Induction Sequence...");

  // 1. Flush Existing Registry
  await pool.query("DELETE FROM bookings");
  await pool.query("DELETE FROM turfs");
  await pool.query("DELETE FROM users WHERE role IN ('owner', 'user')");

  const ownerPassword = await hash("Owner@123");

  // 2. Initializing Management Nodes (Owners)
  const owners: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const id = randomUUID();
    await pool.query(`
      INSERT INTO users (id, name, email, phone, password, role, earnings_total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [id, `Owner Node ${i}`, `owner${i}@turff.local`, `+91-98765-0000${i % 10}`, ownerPassword, 'owner', Math.floor(Math.random() * 50000)]);
    owners.push(id);
  }

  // 3. Initializing Global Arena Registry (100 Turfs)
  const cityKeys = Object.keys(CITIES);
  for (let i = 1; i <= 100; i++) {
    const id = randomUUID();
    const ownerId = owners[Math.floor(Math.random() * owners.length)];
    const city = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    const areas = CITIES[city as keyof typeof CITIES];
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    const sport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
    const name = `${area} ${sport} Arena`;
    const price_weekday = Math.floor(Math.random() * (2500 - 800) + 800);
    const price_weekend = price_weekday + Math.floor(Math.random() * 500 + 200);
    
    const myAmenities = AMENITIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
    const myImages = TURF_IMAGES.sort(() => 0.5 - Math.random()).slice(0, 2);

    await pool.query(`
      INSERT INTO turfs (
        id, owner_id, name, description, location_city, location_address, 
        images, sports_available, amenities, price_weekday, price_weekend, 
        rating, total_reviews, opening_time, closing_time, slot_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      id, ownerId, name,
      `${sport} facility with professional terrain and high-intensity floodlighting. Optimized for competitive matches.`,
      city, `${area}, ${city}`,
      JSON.stringify(myImages), sport, JSON.stringify(myAmenities),
      price_weekday, price_weekend,
      (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
      Math.floor(Math.random() * 200),
      "06:00", "23:00", 60
    ]);

    if (i % 20 === 0) console.log(`📡 Registered ${i} nodes in regional registry...`);
  }

  console.log("✅ Mega-Induction Sequence Complete.");
}
