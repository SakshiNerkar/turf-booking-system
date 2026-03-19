begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'owner', 'customer');
  end if;
  if not exists (select 1 from pg_type where typname = 'timeslot_status') then
    create type timeslot_status as enum ('available', 'booked', 'blocked');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'success', 'failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type payment_type as enum ('online', 'offline');
  end if;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  password text not null,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists turfs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  location text not null,
  sport_type text not null,
  price_per_slot numeric(10,2) not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists time_slots (
  id uuid primary key default gen_random_uuid(),
  turf_id uuid not null references turfs(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status timeslot_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint time_slots_time_check check (end_time > start_time),
  constraint time_slots_unique_range unique (turf_id, start_time, end_time)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  slot_id uuid not null references time_slots(id) on delete cascade,
  players int not null,
  total_price numeric(10,2) not null,
  payment_status payment_status not null default 'pending',
  booking_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_players_check check (players > 0),
  constraint bookings_unique_slot unique (slot_id)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  payment_type payment_type not null,
  payment_status payment_status not null,
  created_at timestamptz not null default now(),
  constraint payments_unique_booking unique (booking_id)
);

create table if not exists revenue (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  turf_id uuid not null references turfs(id) on delete cascade,
  amount numeric(10,2) not null,
  date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_turfs_owner on turfs(owner_id);
create index if not exists idx_turfs_location on turfs(location);
create index if not exists idx_turfs_sport_type on turfs(sport_type);

create index if not exists idx_time_slots_turf on time_slots(turf_id);
create index if not exists idx_time_slots_start on time_slots(start_time);

create index if not exists idx_bookings_user on bookings(user_id);
create index if not exists idx_bookings_turf on bookings(turf_id);
create index if not exists idx_bookings_date on bookings(booking_date);

create index if not exists idx_revenue_owner on revenue(owner_id);
create index if not exists idx_revenue_turf on revenue(turf_id);
create index if not exists idx_revenue_date on revenue(date);

commit;

