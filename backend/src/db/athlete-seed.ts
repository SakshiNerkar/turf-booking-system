import { pool } from "../config/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

const INDIAN_NAMES = [
  "Rahul Verma", "Sneha Gupta", "Amit Patel", "Priya Reddy", "Vikram Singh", 
  "Anjali Mehta", "Karan Sharma", "Divya Iyer", "Sanjay Kapoor", "Meera Rao",
  "Ravi Nair", "Shweta Malhotra", "Manish Chatterjee", "Pallavi Saxena", "Alok Joshi",
  "Ritu Deshmukh", "Sameer Kulkarni", "Pooja Das", "Deepak Bhat", "Neha Ghosh",
  "Arun Shah", "Kavita Misra", "Sunil Ahuja", "Farhan Khan", "Rajesh Chauhan",
  "Gita Gandhi", "Preeti Pillai", "Abhay Jain", "Rekha Agarwal", "Sandeep Bansal",
  "Madhav Varma", "Rashmi Hegde", "Ashok Chawla", "Lata Singhania", "Vijay Rathore",
  "Suman Bajaj", "Nitin Kamat", "Prakash Jha", "Usha Menon", "Gopal Krishnan",
  "Savitri Devi", "Harish Rawat", "Pratibha Singh", "Yogesh Bhardwaj", "Kiran Mazumdar",
  "Naveen Jindal", "Shobhana Bhartia", "Anand Mahindra", "Ratan Tata", "Azim Premji",
  "Mukesh Ambani", "Gautam Adani", "Kumar Birla", "Shiv Nadar", "Uday Kotak",
  "Radhakishan Damani", "Dilip Shanghvi", "Cyrus Poonawalla", "Savitri Jindal", "Sunil Mittal",
  "Madhu Pandit", "Vinod Khosla", "Romesh Wadhwani", "Jayshree Ullal", "Bharat Desai",
  "Neerja Sethi", "Indra Nooyi", "Satya Nadella", "Sundar Pichai", "Shantanu Narayen",
  "Parag Agrawal", "Nikesh Arora", "George Kurian", "Thomas Kurian", "Anjali Sud",
  "Amrapali Gan", "Leena Nair", "Vikas Khanna", "Gaggan Anand", "Pooja Dhingra",
  "Garima Arora", "Sanjeev Kapoor", "Tarla Dalal", "Kunala Kapur", "Ranveer Brar",
  "Vicky Ratnani", "Shipra Khanna", "Nita Mehta", "Hari Nayak", "Vineet Bhatia",
  "Manish Mehrotra", "Sriram Aylur", "Alfred Prasad", "Atul Kochhar", "Vivek Singh",
  "Roopa Gulati", "Monisha Bharadwaj", "Anjum Anand", "Maunika Gowardhan", "Mallika Basu"
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
