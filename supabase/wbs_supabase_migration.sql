-- Supabase migration for Yayasan Wadah Berbagi Sesama (WBS)
-- Run this in Supabase SQL Editor for project tnwnmotbjhdefkzsdpuj.
-- It creates website data tables, enables RLS, and grants Data API access.

create table if not exists public.programs (id text primary key, category text not null, title text not null, description text, image text, "createdAt" timestamptz default now());
create table if not exists public.campaigns (id text primary key, category text not null, title text not null, description text, collected numeric default 0, target numeric default 0, deadline date, image text, featured boolean default false, "createdAt" timestamptz default now());
create table if not exists public.articles (id text primary key, category text not null, title text not null, date date, excerpt text, image text, content text, "createdAt" timestamptz default now());
create table if not exists public.gallery (id text primary key, title text not null, category text, date date, image text, images jsonb default '[]'::jsonb, "createdAt" timestamptz default now());
create table if not exists public.videos (id text primary key, title text not null, category text, date date, url text not null, thumbnail text, "createdAt" timestamptz default now());
create table if not exists public.documents (id text primary key, category text, title text not null, period text, url text, "fileName" text, "fileType" text, "fileData" text, "createdAt" timestamptz default now());
create table if not exists public.volunteers (id text primary key, name text, phone text, email text, city text, role text, availability text, message text, status text default 'Baru', "createdAt" timestamptz default now());
create table if not exists public.donors (id text primary key, salutation text, name text, "publicName" text, phone text, email text, city text, prayer text, anonymous boolean default false, campaign text, amount numeric, "paymentMethod" text, status text default 'pending_verification', "statusLabel" text default 'Menunggu Konfirmasi', "confirmedAt" timestamptz, "createdAt" timestamptz default now(), "updatedAt" timestamptz);
create table if not exists public.messages (id text primary key, name text, email text, phone text, subject text, message text, status text default 'Baru', "createdAt" timestamptz default now());

alter table public.gallery add column if not exists images jsonb default '[]'::jsonb;
alter table public.donors add column if not exists "statusLabel" text default 'Menunggu Konfirmasi';
alter table public.donors add column if not exists "confirmedAt" timestamptz;
alter table public.donors add column if not exists "updatedAt" timestamptz;

alter table public.programs enable row level security;
alter table public.campaigns enable row level security;
alter table public.articles enable row level security;
alter table public.gallery enable row level security;
alter table public.videos enable row level security;
alter table public.documents enable row level security;
alter table public.volunteers enable row level security;
alter table public.donors enable row level security;
alter table public.messages enable row level security;

-- Data API grants. RLS policies below still control row access.
grant select on public.programs to anon, authenticated;
grant all on public.programs to authenticated;
grant select on public.campaigns to anon, authenticated;
grant all on public.campaigns to authenticated;
grant select on public.articles to anon, authenticated;
grant all on public.articles to authenticated;
grant select on public.gallery to anon, authenticated;
grant all on public.gallery to authenticated;
grant select on public.videos to anon, authenticated;
grant all on public.videos to authenticated;
grant select on public.documents to anon, authenticated;
grant all on public.documents to authenticated;
grant insert on public.volunteers to anon, authenticated;
grant select, update, delete on public.volunteers to authenticated;
grant insert on public.donors to anon, authenticated;
grant select, update, delete on public.donors to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

-- Public content can be read by website visitors.
drop policy if exists "Public read programs" on public.programs;
create policy "Public read programs" on public.programs for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage programs" on public.programs;
create policy "Authenticated manage programs" on public.programs for all to authenticated using (true) with check (true);
drop policy if exists "Public read campaigns" on public.campaigns;
create policy "Public read campaigns" on public.campaigns for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage campaigns" on public.campaigns;
create policy "Authenticated manage campaigns" on public.campaigns for all to authenticated using (true) with check (true);
drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles" on public.articles for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage articles" on public.articles;
create policy "Authenticated manage articles" on public.articles for all to authenticated using (true) with check (true);
drop policy if exists "Public read gallery" on public.gallery;
create policy "Public read gallery" on public.gallery for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage gallery" on public.gallery;
create policy "Authenticated manage gallery" on public.gallery for all to authenticated using (true) with check (true);
drop policy if exists "Public read videos" on public.videos;
create policy "Public read videos" on public.videos for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage videos" on public.videos;
create policy "Authenticated manage videos" on public.videos for all to authenticated using (true) with check (true);
drop policy if exists "Public read documents" on public.documents;
create policy "Public read documents" on public.documents for select to anon, authenticated using (true);
drop policy if exists "Authenticated manage documents" on public.documents;
create policy "Authenticated manage documents" on public.documents for all to authenticated using (true) with check (true);

-- Public forms can insert data, but visitors cannot read submitted donor/volunteer/contact data.
drop policy if exists "Public insert volunteers" on public.volunteers;
create policy "Public insert volunteers" on public.volunteers for insert to anon, authenticated with check (true);
drop policy if exists "Authenticated manage volunteers" on public.volunteers;
create policy "Authenticated manage volunteers" on public.volunteers for all to authenticated using (true) with check (true);
drop policy if exists "Public insert donors" on public.donors;
create policy "Public insert donors" on public.donors for insert to anon, authenticated with check (true);
drop policy if exists "Authenticated manage donors" on public.donors;
create policy "Authenticated manage donors" on public.donors for all to authenticated using (true) with check (true);
drop policy if exists "Public insert messages" on public.messages;
create policy "Public insert messages" on public.messages for insert to anon, authenticated with check (true);
drop policy if exists "Authenticated manage messages" on public.messages;
create policy "Authenticated manage messages" on public.messages for all to authenticated using (true) with check (true);

-- No seed data is inserted. Add official WBS content through the admin dashboard or verified database migration.
