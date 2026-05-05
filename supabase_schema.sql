-- ============================================================
-- DR. CUTERUS — SUPABASE DATABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  birth_year integer,
  height_cm numeric(5,1) default 165.0,
  weight_kg numeric(5,1) default 60.0,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. ONBOARDING RESPONSES TABLE
create table if not exists public.onboarding_responses (
  id uuid references auth.users(id) on delete cascade primary key,
  for_self boolean default true,
  how_found_us text,
  goals text[] default '{}',
  period_regularity text,
  period_feelings text,
  cycle_mood text,
  health_conditions text[] default '{}',
  symptoms text[] default '{}',
  cycle_symptoms text[] default '{}',
  energy_impact text,
  sleep_impact text,
  mental_health text[] default '{}',
  sleep_improvement text[] default '{}',
  sleep_hours text,
  discharge_awareness text,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.onboarding_responses enable row level security;

create policy "Users can view own onboarding"
  on public.onboarding_responses for select
  using (auth.uid() = id);

create policy "Users can insert own onboarding"
  on public.onboarding_responses for insert
  with check (auth.uid() = id);

create policy "Users can update own onboarding"
  on public.onboarding_responses for update
  using (auth.uid() = id);


-- 3. PERIOD DATES TABLE
create table if not exists public.period_dates (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table public.period_dates enable row level security;

create policy "Users can view own period dates"
  on public.period_dates for select
  using (auth.uid() = user_id);

create policy "Users can insert own period dates"
  on public.period_dates for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own period dates"
  on public.period_dates for delete
  using (auth.uid() = user_id);


-- 4. DAILY LOGS TABLE
create table if not exists public.daily_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null,
  mood text,
  symptoms text[] default '{}',
  notes text default '',
  hashtags text default '',
  period_status text default 'no-period',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, log_date)
);

alter table public.daily_logs enable row level security;

create policy "Users can view own daily logs"
  on public.daily_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily logs"
  on public.daily_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily logs"
  on public.daily_logs for update
  using (auth.uid() = user_id);


-- 5. USER SETTINGS TABLE
create table if not exists public.user_settings (
  id uuid references auth.users(id) on delete cascade primary key,
  pill_enabled boolean default false,
  pill_time text default '09:00',
  pill_name text default 'Birth Control',
  notif_period boolean default true,
  notif_fertile boolean default true,
  notif_insights boolean default true,
  notif_time text default '08:30',
  theme text default 'light',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = id);


-- 6. PARTNER SYNC TABLE
create table if not exists public.partner_sync (
  id uuid references auth.users(id) on delete cascade primary key,
  enabled boolean default false,
  partner_name text default '',
  partner_email text default '',
  sync_code text not null,
  status text default 'disconnected' check (status in ('disconnected', 'pending', 'connected')),
  share_symptoms boolean default true,
  share_mood boolean default true,
  share_cycle boolean default true,
  share_notifications boolean default false,
  invite_sent_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.partner_sync enable row level security;

create policy "Users can view own partner sync"
  on public.partner_sync for select
  using (auth.uid() = id);

create policy "Users can insert own partner sync"
  on public.partner_sync for insert
  with check (auth.uid() = id);

create policy "Users can update own partner sync"
  on public.partner_sync for update
  using (auth.uid() = id);


-- ============================================================
-- AUTO-CREATE settings + partner_sync + onboarding rows on signup
-- ============================================================
create or replace function public.handle_new_user_extras()
returns trigger as $$
begin
  insert into public.user_settings (id) values (new.id);
  insert into public.partner_sync (id, sync_code)
    values (new.id, 'DC-' || upper(substr(md5(random()::text), 1, 6)));
  insert into public.onboarding_responses (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_extras on auth.users;
create trigger on_auth_user_created_extras
  after insert on auth.users
  for each row execute function public.handle_new_user_extras();


-- ============================================================
-- DONE! All tables created with Row Level Security.
-- Users can only read/write their own data.
-- ============================================================
