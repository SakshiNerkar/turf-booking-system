begin;

-- Initial clean schema reset for absolute data integrity
drop schema public cascade;
create schema public;
grant all on schema public to postgres;
grant all on schema public to public;
set search_path to public;

create extension if not exists pgcrypto;

-- 1. Operational Logic Types
create type user_role as enum ('admin', 'owner', 'user', 'customer');
create type timeslot_status as enum ('available', 'booked', 'blocked');
create type payment_status as enum ('pending', 'paid', 'failed');

-- 2. Core User Identity Ledger
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Owner Operational Profiles
create table owner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  business_name text,
  gst_number text,
  bank_account_number text,
  upi_id text,
  total_earnings numeric(12,2) default 0,
  rating numeric(2,1) default 0.0,
  total_reviews integer default 0,
  is_verified_by_admin boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Financial Intelligence Node
create table owner_finance (
  owner_id uuid primary key references users(id) on delete cascade,
  total_earnings numeric(12,2) default 0,
  monthly_earnings numeric(12,2) default 0,
  pending_payouts numeric(12,2) default 0,
  updated_at timestamptz not null default now()
);

-- 5. Arena Global Registry
create table turfs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  description text,
  location_city text not null,
  location_address text not null,
  latitude numeric(10,8),
  longitude numeric(11,8),
  sports_available text not null,
  amenities text, -- JSON array
  price_weekday numeric(10,2) not null,
  price_weekend numeric(10,2) not null,
  rating numeric(2,1) default 0.0,
  total_reviews integer default 0,
  opening_time text default '06:00',
  closing_time text default '23:00',
  slot_duration integer default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Arena Visual Node Registry
create table turf_images (
  id uuid primary key default gen_random_uuid(),
  turf_id uuid not null references turfs(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz not null default now()
);

-- 7. Operational Schedule Sync
create table time_slots (
  id uuid primary key default gen_random_uuid(),
  turf_id uuid not null references turfs(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status timeslot_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Booking Transactions Logic
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  owner_id uuid not null references users(id) on delete cascade,
  booking_date date not null,
  start_time text not null,
  end_time text not null,
  total_price numeric(10,2) not null,
  status text not null default 'confirmed',
  payment_status payment_status not null default 'pending',
  booking_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Fan Engagement (Favorites)
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, turf_id)
);

-- 10. Operational Broadcast Node (Notifications)
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

-- 11. Platform Reviews Node
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Data Performance Indices
create index idx_turfs_city on turfs(location_city);
create index idx_turf_images_turf on turf_images(turf_id);
create index idx_bookings_user on bookings(user_id);
create index idx_bookings_owner on bookings(owner_id);
create index idx_owner_profiles_user on owner_profiles(user_id);
create index idx_favorites_user on favorites(user_id);
create index idx_notifications_user on notifications(user_id);

commit;
