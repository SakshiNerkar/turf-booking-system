import { pool } from "../config/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

const INDIAN_NAMES = [
  "Aarav Sharma", "Vihaan Gupta", "Arjun Patel", "Sai Reddy", "Advik Singh", 
  "Reyansh Mehta", "Aryan Verma", "Ishan Iyer", "Shaurya Kapoor", "Atharv Rao",
  "Aavya Nair", "Diya Malhotra", "Ishani Chatterjee", "Myra Saxena", "Saanvi Joshi",
  "Anaya Deshmukh", "Aarya Kulkarni", "Prisha Das", "Ananya Bhat", "Kiara Ghosh",
  "Vivaan Shah", "Aditya Misra", "Kabir Ahuja", "Zoya Khan", "Aaryan Chauhan",
  "Sia Gandhi", "Kyra Pillai", "Ira Jain", "Advika Agarwal", "Amaira Bansal",
  "Rohan Varma", "Siddharth Hegde", "Varun Chawla", "Karan Singhania", "Ishaan Rathore",
  "Rahul Bajaj", "Vijay Mallya", "Sachin Tendli", "Virat Kohli", "MS Dhoni",
  "Rohit Sharma", "Shubman Gill", "Hardik Pandya", "KL Rahul", "Surya Yadav",
  "Rishabh Pant", "Shreyas Iyer", "Axar Patel", "Yuzi Chahal", "Kuldeep Yadav",
  "Mohammed Shami", "Bhuvi Kumar", "Jasprit Bumrah", "Arshdeep Singh", "Sanju Samson",
  "Ishan Kishan", "Prithvi Shaw", "Umesh Yadav", "Deepak Chahar", "Shardul Thakur",
  "Smriti Mandhana", "Harmanpreet Kaur", "Jemimah Rodrigues", "Shafali Verma", "Deepti Sharma",
  "Pooja Vastrakar", "Richa Ghosh", "Renuka Singh", "Radha Yadav", "Sneh Rana",
  "Rajesh Kumar", "Suresh Raina", "Amit Shah", "Narendra Modi", "Arvind Kejriwal",
  "Rahul Gandhi", "Mamata Banerjee", "Nitish Kumar", "Yogi Adityanath", "M K Stalin",
  "Pinarayi Vijayan", "Hemant Soren", "Bhagwant Mann", "Shivraj Singh", "Ashok Gehlot",
  "Manohar Lal", "Pushkar Dhami", "Sukhvinder Sukhu", "Eknath Shinde", "Siddaramaiah",
  "Revanth Reddy", "YS Jagan", "Naveen Patnaik", "Biren Singh", "Neiphiu Rio",
  "Conrad Sangma", "Prem Singh", "Manik Saha", "Lalduhoma", "Soren Patnaik"
];

const CITIES = ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];

async function seedAthletes() {
  console.log("🚀 Initializing High-Fidelity Athlete Induction (100 Nodes)...");
  
  const passwordHash = await hash("User@123", 10);
  
  try {
    // We don't delete owners/admins to avoid breaking existing turfs
    // We only add 100 fresh Athlete nodes
    
    for (let i = 0; i < 100; i++) {
      const id = randomUUID();
      const name = INDIAN_NAMES[i % INDIAN_NAMES.length];
      const firstName = name?.split(" ")[0]?.toLowerCase();
      const email = `${firstName}.${Math.floor(Math.random() * 9999)}@turff.local`;
      const phone = `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];

      await pool.query(`
        INSERT INTO users (id, name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5, 'user')
        ON CONFLICT (email) DO NOTHING
      `, [id, name, email, passwordHash, phone]);

      if ((i + 1) % 20 === 0) {
        console.log(`📡 Registered ${i + 1} high-fidelity athlete nodes...`);
      }
    }

    console.log("✅ Athlete Induction Sequence Complete (100 Genuine Profiles).");
    process.exit(0);
  } catch (error) {
    console.error("❌ Induction Failure:", error);
    process.exit(1);
  }
}

seedAthletes();
