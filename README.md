# 🏟️ Turff — Sports Turf Booking System

A full-stack sports turf booking platform built with **Next.js 16**, **Express.js**, **TypeScript**, and **PostgreSQL**.

---

## 🚀 Quick Start (2 steps)

### Step 1 — Get a Free PostgreSQL Database

You need a PostgreSQL database. The easiest (and free) option is **Neon**:

1. Go to **[https://neon.tech](https://neon.tech)** and click **"Sign Up"** (free, no credit card)
2. Create a new **Project** → give it any name (e.g. `turff`)
3. Once created, click **"Connect"** → select **"Connection string"**
4. Copy the connection string — it looks like:
   ```
   postgresql://neondb_owner:abc123@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Open `d:\Turff\backend\.env` and replace the `DATABASE_URL` line with your string

**Alternative free providers:**
- [Supabase](https://supabase.com) → Settings → Database → Connection string
- [Railway](https://railway.app) → New Project → PostgreSQL → Connect

### Step 2 — Run the Setup Wizard

```cmd
cd d:\Turff
node setup-db.js
```

The wizard will:
- Validate your connection string
- Run all database migrations (creates tables)
- Seed demo accounts and sample turfs

---

## ▶️ Running the App

Open **two terminal windows**:

**Terminal 1 — Backend API (port 4000):**
```cmd
cd d:\Turff\backend
npm run dev
```

**Terminal 2 — Frontend (port 3000):**
```cmd
cd d:\Turff\frontend
npm run dev
```

Open your browser: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👤 Customer | `customer@turff.local` | `Customer@123` |
| 🏟️ Owner | `owner@turff.local` | `Owner@123` |
| ⚙️ Admin | `admin@turff.local` | `Admin@123` |

---

## 🗂️ Project Structure

```
Turff/
├── backend/          Express.js API (TypeScript)
│   ├── src/
│   │   ├── config/   DB + env config
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/       migrate.ts, seed.ts
│   ├── migrations/   SQL migration files
│   └── .env          ← your DATABASE_URL goes here
│
├── frontend/         Next.js 16 App Router (TypeScript)
│   ├── src/
│   │   ├── app/      Pages (login, register, turfs, dashboard/*)
│   │   ├── components/ Navbar, Footer, CalendarBooking...
│   │   └── lib/      api.ts, auth.ts, toast.ts
│   └── .env.local    Frontend env
│
├── setup-db.js       ← Interactive DB setup wizard
└── package.json      Root convenience scripts
```

---

## 🌐 API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/health` | DB connection status | None |
| POST | `/api/auth/register` | Create account | None |
| POST | `/api/auth/login` | Sign in, get JWT | None |
| GET | `/api/turfs` | List turfs (filter/search) | None |
| GET | `/api/turfs/:id` | Turf details + slots | None |
| POST | `/api/turfs` | Create turf | Owner |
| PUT | `/api/turfs/:id` | Update turf | Owner |
| DELETE | `/api/turfs/:id` | Delete turf | Owner |
| POST | `/api/turfs/:id/slots` | Add slot | Owner |
| PATCH | `/api/slots/:id` | Block/unblock slot | Owner |
| GET | `/api/bookings` | My bookings | Any |
| POST | `/api/bookings` | Book a slot | Customer |
| POST | `/api/payments` | Process payment | Customer |
| GET | `/api/admin/users` | All users | Admin |
| GET | `/api/admin/turfs` | All turfs | Admin |
| GET | `/api/admin/bookings` | All bookings | Admin |
| GET | `/api/admin/revenue` | Revenue data | Admin |

---

## 🔧 Troubleshooting

### ❌ "Cannot connect to backend"
→ Make sure `npm run dev` is running in `d:\Turff\backend`

### ❌ "Database is not connected"
→ Your `DATABASE_URL` in `backend/.env` is wrong or the cloud DB might be sleeping (Neon sleeps after 5min on free tier — it wakes up on next query, takes ~2s)

### ❌ "ECONNREFUSED 127.0.0.1:5432"
→ You're using a localhost connection string but PostgreSQL isn't installed. Use a cloud DB URL from Neon/Supabase instead.

### ❌ Backend exits immediately
→ Check `backend/.env` exists with valid `DATABASE_URL` and `JWT_SECRET`

### ❌ Frontend shows blank page
→ Make sure the frontend dev server is running: `cd frontend && npm run dev`

---

## 🛠️ DB Commands

```cmd
# Run migrations (create tables)
cd backend && npm run db:migrate

# Seed demo data
cd backend && npm run db:seed
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Express.js 5, TypeScript, Node.js 24 |
| Database | PostgreSQL (via Neon / Supabase / Railway) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Calendar | FullCalendar 6 |
| Notifications | Sonner |
| Validation | Zod |
