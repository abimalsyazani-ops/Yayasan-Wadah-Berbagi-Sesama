-- Run once in the Supabase SQL Editor for the WBS project.
-- Adds book-donation submissions and the follow-up fields used by the admin dashboard.

create table if not exists public.book_donations (
  id text primary key,
  name text,
  phone text,
  email text,
  city text,
  "bookCount" integer,
  "bookType" text,
  "pickupAddress" text,
  message text,
  status text default 'pending_follow_up',
  "statusLabel" text default 'Menunggu Follow-up',
  "confirmedAt" timestamptz,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

alter table public.programs add column if not exists "updatedAt" timestamptz;
alter table public.campaigns add column if not exists "updatedAt" timestamptz;
alter table public.articles add column if not exists "updatedAt" timestamptz;
alter table public.gallery add column if not exists "updatedAt" timestamptz;
alter table public.videos add column if not exists "updatedAt" timestamptz;
alter table public.documents add column if not exists "updatedAt" timestamptz;
alter table public.volunteers add column if not exists motivation text;
alter table public.volunteers add column if not exists "statusLabel" text default 'Menunggu Follow-up';
alter table public.volunteers add column if not exists "confirmedAt" timestamptz;
alter table public.volunteers add column if not exists "updatedAt" timestamptz;
alter table public.messages add column if not exists "statusLabel" text default 'Menunggu Follow-up';
alter table public.messages add column if not exists "confirmedAt" timestamptz;
alter table public.messages add column if not exists "updatedAt" timestamptz;

alter table public.book_donations enable row level security;

revoke all on table public.book_donations from anon, authenticated;
grant insert on table public.book_donations to anon;
grant select, insert, update, delete on table public.book_donations to authenticated;

drop policy if exists "Public insert book donations" on public.book_donations;
create policy "Public insert book donations"
on public.book_donations for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated manage book donations" on public.book_donations;
create policy "Authenticated manage book donations"
on public.book_donations for all
to authenticated
using (true)
with check (true);
