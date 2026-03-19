/**
 * setup-db.js — Run this to configure your free PostgreSQL database.
 * Usage: node setup-db.js
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ENV_PATH = path.join(__dirname, "backend", ".env");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function banner(text, char = "─") {
  const line = char.repeat(60);
  console.log("\n" + line);
  console.log(" " + text);
  console.log(line);
}

async function main() {
  console.clear();
  banner("🏟️  TURFF — Database Setup Wizard", "═");

  console.log(`
This wizard will help you connect a FREE PostgreSQL database to Turff.

No Docker needed. No local PostgreSQL needed.
Just create a free account on one of these providers:

  1. 🌟 Neon (recommended)  → https://neon.tech
  2. 🟢 Supabase            → https://supabase.com  
  3. 🚂 Railway             → https://railway.app

QUICK GUIDE for Neon (takes ~2 minutes):
  ① Go to https://neon.tech and click "Sign Up" (free)
  ② Create a new project → pick any region near you
  ③ Click "Connect" → choose "Connection string"
  ④ Copy the connection string (starts with postgresql://...)
  ⑤ Paste it below
`);

  const choice = await question("Press ENTER to continue, or type 'q' to quit: ");
  if (choice.toLowerCase() === "q") {
    console.log("\nBye!\n");
    rl.close();
    return;
  }

  console.log("\n📋 Paste your PostgreSQL connection string below:");
  console.log("   (It should look like: postgresql://user:pass@host/dbname)\n");

  const dbUrl = await question("→ DATABASE_URL: ");

  if (!dbUrl.trim().startsWith("postgresql://") && !dbUrl.trim().startsWith("postgres://")) {
    console.error("\n❌ Invalid connection string. It must start with postgresql:// or postgres://\n");
    rl.close();
    return;
  }

  // Read existing .env
  let envContent = "";
  try {
    envContent = fs.readFileSync(ENV_PATH, "utf8");
  } catch {
    envContent = `PORT=4000
NODE_ENV=development
JWT_SECRET=dev_only_change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
`;
  }

  // Update DATABASE_URL
  if (envContent.includes("DATABASE_URL=")) {
    envContent = envContent.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${dbUrl.trim()}`);
  } else {
    envContent += `\nDATABASE_URL=${dbUrl.trim()}\n`;
  }

  fs.writeFileSync(ENV_PATH, envContent, "utf8");
  console.log("\n✅ DATABASE_URL saved to backend/.env");

  // Run migrations
  console.log("\n⏳ Running database migrations...\n");
  try {
    execSync("npm run db:migrate", {
      cwd: path.join(__dirname, "backend"),
      stdio: "inherit",
      shell: "cmd",
    });
    console.log("\n✅ Migrations complete!");
  } catch (err) {
    console.error("\n❌ Migration failed. Check your connection string and try again.");
    rl.close();
    return;
  }

  // Run seed
  console.log("\n⏳ Seeding demo data (users + turfs + slots)...\n");
  try {
    execSync("npm run db:seed", {
      cwd: path.join(__dirname, "backend"),
      stdio: "inherit",
      shell: "cmd",
    });
    console.log("\n✅ Seed complete!");
  } catch (err) {
    console.warn("\n⚠️  Seed failed (might already be seeded, that's OK).");
  }

  banner("✅ Setup Complete!", "═");
  console.log(`
Demo Accounts (ready to use):
  👤 Customer  — customer@turff.local / Customer@123
  🏟️  Owner     — owner@turff.local / Owner@123
  ⚙️  Admin     — admin@turff.local / Admin@123

Next steps:
  1. Start backend:  cd backend && npm run dev
  2. Start frontend: cd frontend && npm run dev
  3. Open browser:   http://localhost:3000
`);

  rl.close();
}

main().catch((err) => {
  console.error("Setup failed:", err);
  rl.close();
});
