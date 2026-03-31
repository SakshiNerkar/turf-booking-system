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
  { "name": "HotFut", "city": "Pune", "area": "Koregaon Park", "sport": "Football", "lat": 18.5412, "lng": 73.9059 },
  { "name": "GameOn", "city": "Bangalore", "area": "Marathahalli", "sport": "Football", "lat": 12.9562, "lng": 77.7019 },
  { "name": "Rush Arena", "city": "Bangalore", "area": "Rajajinagar", "sport": "Cricket", "lat": 12.9882, "lng": 77.5512 },
  { "name": "Tackle Jayanagar", "city": "Bangalore", "area": "Jayanagar", "sport": "Football", "lat": 12.9296, "lng": 77.5812 },
  { "name": "South United FC", "city": "Bangalore", "area": "Ulsoor", "sport": "Football", "lat": 12.9816, "lng": 77.6259 },
  { "name": "The Bull Ring", "city": "Bangalore", "area": "Indiranagar", "sport": "Football", "lat": 12.9712, "lng": 77.6412 },
  { "name": "Kicks on Grass", "city": "Bangalore", "area": "Bellandur", "sport": "Football", "lat": 12.9263, "lng": 77.6762 },
  { "name": "Decathlon Anubhava", "city": "Bangalore", "area": "Bagalur", "sport": "Football", "lat": 13.1112, "lng": 77.6325 },
  { "name": "Power Play", "city": "Bangalore", "area": "Whitefield", "sport": "Cricket", "lat": 12.9698, "lng": 77.7499 },
  { "name": "Footy Grounds", "city": "Bangalore", "area": "HSR Layout", "sport": "Football", "lat": 12.9128, "lng": 77.6386 },
  { "name": "The Arena", "city": "Bangalore", "area": "Koramangala", "sport": "Football", "lat": 12.9352, "lng": 77.6111 },
  { "name": "Kick Off", "city": "Delhi", "area": "Malviya Nagar", "sport": "Football", "lat": 28.5369, "lng": 77.2112 },
  { "name": "The Base", "city": "Delhi", "area": "Vasant Kunj", "sport": "Football", "lat": 28.5292, "lng": 77.1512 },
  { "name": "Hudle Arena", "city": "Delhi", "area": "Nehru Park", "sport": "Football", "lat": 28.5912, "lng": 77.1986 },
  { "name": "New Era Sports", "city": "Delhi", "area": "Tilak Nagar", "sport": "Cricket", "lat": 28.6361, "lng": 77.0855 },
  { "name": "Plaza Turf", "city": "Delhi", "area": "Saket", "sport": "Football", "lat": 28.5212, "lng": 77.2131 },
  { "name": "Siri Fort Sports Complex", "city": "Delhi", "area": "Siri Fort", "sport": "Badminton", "lat": 28.5512, "lng": 77.2212 },
  { "name": "Major Dhyan Chand Stadium", "city": "Delhi", "area": "Central Delhi", "sport": "Football", "lat": 28.6139, "lng": 77.2312 },
  { "name": "Yamuna Sports Complex", "city": "Delhi", "area": "East Delhi", "sport": "Cricket", "lat": 28.6512, "lng": 77.2912 },
  { "name": "Saket Sports Complex", "city": "Delhi", "area": "Saket", "sport": "Football", "lat": 28.5244, "lng": 77.2186 },
  { "name": "Thyagaraj Stadium", "city": "Delhi", "area": "INA", "sport": "Badminton", "lat": 28.5712, "lng": 77.2086 },
  { "name": "Azone Sports", "city": "Hyderabad", "area": "Hafeezpet", "sport": "Football", "lat": 17.4712, "lng": 78.3412 },
  { "name": "Astro Park", "city": "Hyderabad", "area": "Jubilee Hills", "sport": "Football", "lat": 17.4312, "lng": 78.4112 },
  { "name": "The Turf Adventure", "city": "Hyderabad", "area": "Moinabad", "sport": "Cricket", "lat": 17.3312, "lng": 78.2812 },
  { "name": "Turf4U", "city": "Hyderabad", "area": "Miyapur", "sport": "Football", "lat": 17.5012, "lng": 78.3512 },
  { "name": "JS Sports Arena", "city": "Hyderabad", "area": "Madinaguda", "sport": "Cricket", "lat": 17.4812, "lng": 78.3312 },
  { "name": "7 Strikers", "city": "Hyderabad", "area": "Beeramguda", "sport": "Football", "lat": 17.5212, "lng": 78.2912 },
  { "name": "Power Play", "city": "Hyderabad", "area": "Gachibowli", "sport": "Football", "lat": 17.4412, "lng": 78.3412 },
  { "name": "Game On", "city": "Hyderabad", "area": "Madhapur", "sport": "Cricket", "lat": 17.4512, "lng": 78.3812 },
  { "name": "Golazo", "city": "Hyderabad", "area": "Gachibowli", "sport": "Football", "lat": 17.4455, "lng": 78.3486 },
  { "name": "Strike Arena", "city": "Hyderabad", "area": "Secunderabad", "sport": "Football", "lat": 17.4412, "lng": 78.4986 }
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
  const allTurfsToSeed: any[] = [...REAL_TURFS];
  for (let i = 0; i < 50; i++) {
    const base = REAL_TURFS[i % REAL_TURFS.length]!;
    allTurfsToSeed.push({
      name: `${base.area} Pro ${base.sport} Hub`,
      city: base.city, area: base.area, sport: base.sport,
      lat: base.lat + (Math.random() - 0.5) * 0.05,
      lng: base.lng + (Math.random() - 0.5) * 0.05
    });
  }

  for (let i = 0; i < allTurfsToSeed.length; i++) {
    const t = allTurfsToSeed[i]!;
    const id = randomUUID();
    const ownerId = owners[Math.floor(Math.random() * owners.length)]!;
    const price_weekday = Math.floor(Math.random() * (2500 - 800) + 800);
    const price_weekend = price_weekday + Math.floor(Math.random() * 500 + 200);
    const myAmenities = AMENITIES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
    const sportsImgs = SPORT_IMAGES[t.sport] || SPORT_IMAGES["Football"]!;
    const myImages = [sportsImgs[Math.floor(Math.random() * sportsImgs.length)]!];

    await pool.query(`
      INSERT INTO turfs (
        id, owner_id, name, description, location_city, location_address, latitude, longitude,
        images, sports_available, amenities, price_weekday, price_weekend, 
        rating, total_reviews, opening_time, closing_time, slot_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      id, ownerId, t.name,
      `Premium ${t.sport} facility in ${t.area} equipped with high-grade terrain and professional floodlighting.`,
      t.city, `${t.area}, ${t.city}`, t.lat, t.lng,
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
