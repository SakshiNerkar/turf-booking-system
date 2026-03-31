begin;

create extension if not exists pgcrypto;

-- 1. Create Enumerations for Role Consistency
-- 1. Force-Flush Entire Public Schema (Clear all legacy/stale tables/types)
drop schema public cascade;
create schema public;
grant all on schema public to postgres;
grant all on schema public to public;

-- 2. Re-declare Search Path for safety
set search_path to public;

-- 3. Create High-Performance Custom Types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'owner', 'user', 'customer');
  end if;
  if not exists (select 1 from pg_type where typname = 'timeslot_status') then
    create type timeslot_status as enum ('available', 'booked', 'blocked');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'success', 'failed');
  end if;
end $$;

-- 3. High-Fidelity Management Registry (Users)
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  password text not null,
  role user_role not null default 'user',
  profile_image text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  last_login timestamptz,
  earnings_total numeric(12,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Global Arena Registry (Turfs)
create table turfs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  description text,
  location_city text not null,
  location_address text not null,
  latitude numeric(10,8),
  longitude numeric(11,8),
  images text, -- JSON array string
  sports_available text not null, -- Primary sport
  amenities text, -- JSON array string
  price_weekday numeric(10,2) not null,
  price_weekend numeric(10,2) not null,
  rating numeric(2,1) default 5.0,
  total_reviews integer default 0,
  opening_time text default '06:00',
  closing_time text default '23:00',
  slot_duration integer default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Operational Synchronization (Time Slots)
create table time_slots (
  id uuid primary key default gen_random_uuid(),
  turf_id uuid not null references turfs(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status timeslot_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Booking Transactions (High-Fidelity Model)
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  owner_id uuid not null references users(id) on delete cascade,
  booking_date text not null, -- YYYY-MM-DD
  start_time text not null,   -- HH:MM
  end_time text not null,     -- HH:MM
  total_price numeric(10,2) not null,
  status text not null default 'confirmed',
  payment_status text not null default 'pending',
  booking_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indices for Regional Performance
create index idx_turfs_city on turfs(location_city);
create index idx_turfs_owner on turfs(owner_id);
create index idx_bookings_user on bookings(user_id);
create index idx_time_slots_range on time_slots(turf_id, start_time);

commit;
