/**
 * test-db.js — Quick test if your DATABASE_URL is working.
 * Usage: node test-db.js
 */

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env manually
const envPath = path.join(__dirname, "backend", ".env");
try {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        process.env[key] = value;
      }
    }
  }
} catch {
  console.error("❌ Could not read backend/.env");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url || url.includes("user:password@host")) {
  console.error("❌ DATABASE_URL is not set properly in backend/.env");
  console.error("   Please follow the setup instructions in README.md");
  process.exit(1);
}

console.log("🔍 Testing database connection...");
console.log(`   URL: ${url.replace(/:([^:@]+)@/, ":***@")}\n`);

const ssl = url.includes("neon.tech") || url.includes("supabase") || url.includes("railway") || url.includes("sslmode=require")
  ? { rejectUnauthorized: false }
  : false;

const client = new Client({ connectionString: url, ssl });

client.connect()
  .then(() => client.query("SELECT version()"))
  .then((res) => {
    console.log("✅ Database connected successfully!");
    console.log("   PostgreSQL:", res.rows[0].version.split(" ").slice(0, 2).join(" "));
    console.log("\n🚀 Ready! Now run the migrations:");
    console.log("   cd backend && npm run db:migrate");
    console.log("   cd backend && npm run db:seed");
    client.end();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    console.error("\n💡 Common fixes:");
    console.error("   • Make sure you copied the full connection string");
    console.error("   • Neon strings include ?sslmode=require at the end");
    console.error("   • Check for any extra spaces in the URL");
    console.error("\n   Go to https://neon.tech for a free PostgreSQL database.");
    process.exit(1);
  });
