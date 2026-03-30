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
  { "name": "Lucky Sports Hub", "city": "Mumbai", "area": "Chandivali", "sport": "Football" },
  { "name": "V4 Sports Arena", "city": "Mumbai", "area": "Bhandup", "sport": "Football" },
  { "name": "One Shot Turf", "city": "Mumbai", "area": "Goregaon", "sport": "Football" },
  { "name": "Players Turf", "city": "Mumbai", "area": "Andheri East", "sport": "Cricket" },
  { "name": "Force Playing Fields", "city": "Mumbai", "area": "Dahisar", "sport": "Football" },
  { "name": "KICK", "city": "Mumbai", "area": "Andheri West", "sport": "Football" },
  { "name": "Urban Sports", "city": "Mumbai", "area": "Wadala", "sport": "Football" },
  { "name": "Astro Park", "city": "Mumbai", "area": "Worli", "sport": "Football" },
  { "name": "Dream Grounds", "city": "Mumbai", "area": "Malad", "sport": "Cricket" },
  { "name": "The Turf", "city": "Mumbai", "area": "Bandra", "sport": "Football" },
  { "name": "Aurix Multi-Sports Turf", "city": "Pune", "area": "Nande", "sport": "Football" },
  { "name": "Prime Sports Turf", "city": "Pune", "area": "Kharadi", "sport": "Football" },
  { "name": "Turf Up", "city": "Pune", "area": "Kharadi", "sport": "Cricket" },
  { "name": "Turf 9 Arena", "city": "Pune", "area": "Hadapsar", "sport": "Football" },
  { "name": "Pifa Football Academy", "city": "Pune", "area": "Wakad", "sport": "Football" },
  { "name": "Legend Sports Club", "city": "Pune", "area": "Mundhwa", "sport": "Cricket" },
  { "name": "Life Republic Turf", "city": "Pune", "area": "Hinjewadi", "sport": "Football" },
  { "name": "Futsal Station", "city": "Pune", "area": "Koregaon Park", "sport": "Football" },
  { "name": "Goal Squad", "city": "Pune", "area": "Bibwewadi", "sport": "Football" },
  { "name": "HotFut", "city": "Pune", "area": "Koregaon Park", "sport": "Football" },
  { "name": "GameOn", "city": "Bangalore", "area": "Marathahalli", "sport": "Football" },
  { "name": "Rush Arena", "city": "Bangalore", "area": "Rajajinagar", "sport": "Cricket" },
  { "name": "Tackle Jayanagar", "city": "Bangalore", "area": "Jayanagar", "sport": "Football" },
  { "name": "South United FC", "city": "Bangalore", "area": "Ulsoor", "sport": "Football" },
  { "name": "The Bull Ring", "city": "Bangalore", "area": "Indiranagar", "sport": "Football" },
  { "name": "Kicks on Grass", "city": "Bangalore", "area": "Bellandur", "sport": "Football" },
  { "name": "Decathlon Anubhava", "city": "Bangalore", "area": "Bagalur", "sport": "Football" },
  { "name": "Power Play", "city": "Bangalore", "area": "Whitefield", "sport": "Cricket" },
  { "name": "Footy Grounds", "city": "Bangalore", "area": "HSR Layout", "sport": "Football" },
  { "name": "The Arena", "city": "Bangalore", "area": "Koramangala", "sport": "Football" },
  { "name": "Kick Off", "city": "Delhi", "area": "Malviya Nagar", "sport": "Football" },
  { "name": "The Base", "city": "Delhi", "area": "Vasant Kunj", "sport": "Football" },
  { "name": "Hudle Arena", "city": "Delhi", "area": "Nehru Park", "sport": "Football" },
  { "name": "New Era Sports", "city": "Delhi", "area": "Tilak Nagar", "sport": "Cricket" },
  { "name": "Plaza Turf", "city": "Delhi", "area": "Saket", "sport": "Football" },
  { "name": "Siri Fort Sports Complex", "city": "Delhi", "area": "Siri Fort", "sport": "Badminton" },
  { "name": "Major Dhyan Chand Stadium", "city": "Delhi", "area": "Central Delhi", "sport": "Football" },
  { "name": "Yamuna Sports Complex", "city": "Delhi", "area": "East Delhi", "sport": "Cricket" },
  { "name": "Saket Sports Complex", "city": "Delhi", "area": "Saket", "sport": "Football" },
  { "name": "Thyagaraj Stadium", "city": "Delhi", "area": "INA", "sport": "Badminton" },
  { "name": "Azone Sports", "city": "Hyderabad", "area": "Hafeezpet", "sport": "Football" },
  { "name": "Astro Park", "city": "Hyderabad", "area": "Jubilee Hills", "sport": "Football" },
  { "name": "The Turf Adventure", "city": "Hyderabad", "area": "Moinabad", "sport": "Cricket" },
  { "name": "Turf4U", "city": "Hyderabad", "area": "Miyapur", "sport": "Football" },
  { "name": "JS Sports Arena", "city": "Hyderabad", "area": "Madinaguda", "sport": "Cricket" },
  { "name": "7 Strikers", "city": "Hyderabad", "area": "Beeramguda", "sport": "Football" },
  { "name": "Power Play", "city": "Hyderabad", "area": "Gachibowli", "sport": "Football" },
  { "name": "Game On", "city": "Hyderabad", "area": "Madhapur", "sport": "Cricket" },
  { "name": "Golazo", "city": "Hyderabad", "area": "Gachibowli", "sport": "Football" },
  { "name": "Strike Arena", "city": "Hyderabad", "area": "Secunderabad", "sport": "Football" }
];

export async function megaSeed() {
  console.log("🚀 Initializing Mega-Induction Sequence with Authentic Registry Node Data...");

  // 1. Flush Existing Registry
  await pool.query("DELETE FROM users"); // Full wipe

  const adminPassword = await hash("admin123");
  const ownerPassword = await hash("Owner@123");

  // 2. Induct Primary Administrative Node
  await pool.query(`
    INSERT INTO users (id, name, email, phone, password, role, is_active, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [randomUUID(), "System Administrator", "admin@turff.com", "+91-00000-00000", adminPassword, "admin", true, true]);

  // 3. Initializing Management Nodes (Owners)
  const owners: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const id = randomUUID();
    await pool.query(`
      INSERT INTO users (id, name, email, phone, password, role, earnings_total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [id, `Owner Node ${i}`, `owner${i}@turff.local`, `+91-98765-0000${i % 10}`, ownerPassword, 'owner', Math.floor(Math.random() * 50000)]);
    owners.push(id);
  }

  // 4. Initializing Global Arena Registry (100 Authentic-Based Turfs)
  // We use our 50 real turfs and then generate 50 more variations in the same cities
  const allTurfsToSeed = [...REAL_TURFS];
  
  // Generate 50 more based on the same cities/areas
  for (let i = 0; i < 50; i++) {
    const base = REAL_TURFS[i % REAL_TURFS.length]!;
    allTurfsToSeed.push({
      name: `${base.area} Pro ${base.sport} Hub`,
      city: base.city,
      area: base.area,
      sport: base.sport
    });
  }

  for (let i = 0; i < allTurfsToSeed.length; i++) {
    const t = allTurfsToSeed[i]!;
    const id = randomUUID();
    const ownerId = owners[Math.floor(Math.random() * owners.length)]!;
    
    const price_weekday = Math.floor(Math.random() * (2500 - 800) + 800);
    const price_weekend = price_weekday + Math.floor(Math.random() * 500 + 200);
    
    const myAmenities = AMENITIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
    
    // STRICT IMAGE MATCHING
    const sportsImgs = SPORT_IMAGES[t.sport] || SPORT_IMAGES["Football"]!;
    const myImages = [sportsImgs[Math.floor(Math.random() * sportsImgs.length)]!];

    await pool.query(`
      INSERT INTO turfs (
        id, owner_id, name, description, location_city, location_address, 
        images, sports_available, amenities, price_weekday, price_weekend, 
        rating, total_reviews, opening_time, closing_time, slot_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      id, ownerId, t.name,
      `Premium ${t.sport} facility in ${t.area} equipped with high-grade terrain and professional floodlighting. Optimized for competitive matches.`,
      t.city, `${t.area}, ${t.city}`,
      JSON.stringify(myImages), t.sport, JSON.stringify(myAmenities),
      price_weekday, price_weekend,
      (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
      Math.floor(Math.random() * 200),
      "06:00", "23:00", 60
    ]);

    if ((i + 1) % 20 === 0) console.log(`📡 Registered ${i + 1} authentic nodes in regional registry...`);
  }

  console.log("✅ Mega-Induction Sequence Complete.");
}
