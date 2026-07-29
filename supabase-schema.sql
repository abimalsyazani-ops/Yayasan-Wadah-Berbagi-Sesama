-- WBS Finance CRM - Supabase schema foundation
-- Jalankan di Supabase SQL Editor setelah membuat project.
-- Setelah berjalan, ubah APP_MODE di assets/data-store.js menjadi "production".

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.roles (
  name text primary key,
  description text not null
);

insert into public.roles (name, description) values
  ('super_admin','Akses penuh sistem'),
  ('admin','Mengelola data dan operasional'),
  ('finance','Mengelola laporan dan transaksi keuangan'),
  ('verifier','Memverifikasi bukti dan transaksi'),
  ('cs','Customer service / fundraiser'),
  ('viewer','Akses baca terbatas')
on conflict (name) do update set description = excluded.description;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  role text not null default 'viewer' references public.roles(name),
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cs_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  address text not null,
  phone text not null,
  email text not null,
  ktp_file_path text,
  profile_file_path text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  privacy_agreed boolean not null default false,
  data_processing_agreed boolean not null default false,
  status text not null default 'submitted' check (status in ('draft','submitted','under_review','approved','rejected','suspended')),
  review_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cs_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  application_id uuid references public.cs_applications(id),
  full_name text not null,
  phone text,
  email text,
  profile_file_path text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  commission_rate numeric(5,2) not null default 5 check (commission_rate >= 0 and commission_rate <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  target_amount numeric(18,2) not null default 0 check (target_amount >= 0),
  start_date date,
  end_date date,
  status text not null default 'draft' check (status in ('draft','active','paused','completed','closed','archived')),
  image_path text,
  manager_id uuid references auth.users(id),
  gross_amount numeric(18,2) not null default 0,
  net_amount numeric(18,2) not null default 0,
  program_amount numeric(18,2) not null default 0,
  realized_amount numeric(18,2) not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.campaigns (slug, name, description, status)
values ('campaign-umum', 'Campaign Umum', 'Campaign default untuk donasi tanpa pilihan campaign.', 'active')
on conflict (slug) do nothing;

create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_normalized text not null,
  email text,
  address text,
  city text,
  total_donation numeric(18,2) not null default 0,
  transaction_count integer not null default 0,
  last_donation_at timestamptz,
  favorite_campaign_id uuid references public.campaigns(id),
  cs_id uuid references public.cs_profiles(id),
  last_segment text,
  lifetime_segment text,
  note text,
  follow_up_status text default 'new' check (follow_up_status in ('new','contacted','interested','follow_up','donated','inactive','do_not_contact')),
  next_follow_up_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phone_normalized)
);

create table if not exists public.donor_followups (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete cascade,
  cs_id uuid references public.cs_profiles(id),
  status text not null check (status in ('new','contacted','interested','follow_up','donated','inactive','do_not_contact')),
  contact_at timestamptz,
  next_follow_up_at date,
  result text,
  offered_campaign_id uuid references public.campaigns(id),
  opportunity_note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  transaction_no text not null unique,
  donor_id uuid not null references public.donors(id),
  campaign_id uuid not null references public.campaigns(id),
  cs_id uuid references public.cs_profiles(id),
  source text not null default 'website' check (source in ('cs','admin','website','payment_gateway','qris','virtual_account','bank_transfer','other')),
  gross_amount numeric(18,2) not null check (gross_amount > 0),
  commission_rate numeric(5,2) not null default 0 check (commission_rate >= 0 and commission_rate <= 100),
  commission_amount numeric(18,2) not null default 0 check (commission_amount >= 0),
  net_amount numeric(18,2) not null check (net_amount >= 0),
  transfer_date date not null,
  transfer_time time,
  sender_bank text,
  destination_account text,
  reference_number text,
  note text,
  status text not null default 'pending_verification' check (status in ('draft','pending_verification','need_review','verified','approved','posted','rejected','cancelled')),
  idempotency_key text unique,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  posted_by uuid references auth.users(id),
  posted_at timestamptz,
  cancelled_by uuid references auth.users(id),
  cancelled_at timestamptz,
  cancellation_reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reference_number)
);

create table if not exists public.donation_proofs (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 5242880),
  ocr_status text default 'not_started',
  ocr_result jsonb default '{}'::jsonb,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.donation_allocations (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  allocation_type text not null check (allocation_type in ('program','development','operational','endowment')),
  percentage numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  amount numeric(18,2) not null check (amount >= 0),
  configuration_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.commission_records (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null unique references public.donations(id) on delete cascade,
  cs_id uuid not null references public.cs_profiles(id),
  period_key text not null,
  gross_amount numeric(18,2) not null,
  commission_rate numeric(5,2) not null,
  commission_amount numeric(18,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','paid','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_payouts (
  id uuid primary key default gen_random_uuid(),
  cs_id uuid not null references public.cs_profiles(id),
  period_key text not null,
  amount numeric(18,2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','approved','paid','cancelled')),
  approved_by uuid references auth.users(id),
  paid_by uuid references auth.users(id),
  paid_at timestamptz,
  payment_proof_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leaderboard_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'draft' check (status in ('draft','active','closed','locked')),
  created_by uuid references auth.users(id),
  closed_by uuid references auth.users(id),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leaderboard_rewards (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.leaderboard_periods(id) on delete cascade,
  cs_id uuid not null references public.cs_profiles(id),
  rank integer not null check (rank > 0),
  total_amount numeric(18,2) not null default 0,
  total_transactions integer not null default 0,
  bonus_type text default 'top_3',
  bonus_amount numeric(18,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','paid','cancelled')),
  approved_by uuid references auth.users(id),
  paid_at timestamptz,
  payment_proof text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (period_id, cs_id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_type text not null,
  bank_name text,
  account_number text,
  opening_balance numeric(18,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fund_buckets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  bucket_type text not null check (bucket_type in ('program','development','operational','endowment','commission','campaign_general','campaign')),
  campaign_id uuid references public.campaigns(id),
  opening_balance numeric(18,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  transaction_no text not null unique,
  expense_date date not null,
  recipient text not null,
  description text not null,
  category text not null,
  fund_bucket_id uuid not null references public.fund_buckets(id),
  campaign_id uuid references public.campaigns(id),
  amount numeric(18,2) not null check (amount > 0),
  proof_path text,
  status text not null default 'draft' check (status in ('draft','pending_verification','verified','approved','posted','cancelled')),
  created_by uuid references auth.users(id),
  verified_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  posted_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fund_movements (
  id uuid primary key default gen_random_uuid(),
  fund_bucket_id uuid not null references public.fund_buckets(id),
  source_table text not null,
  source_id uuid not null,
  movement_type text not null check (movement_type in ('allocation_in','expense_out','transfer_in','transfer_out','correction')),
  amount numeric(18,2) not null check (amount >= 0),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.system_settings (key, value) values
  ('commission', '{"default_rate":5}'::jsonb),
  ('allocation', '{"program":50,"development":20,"operational":25,"endowment":5,"version":"2026-v1"}'::jsonb)
on conflict (key) do nothing;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null,
  period_start date,
  period_end date,
  filters jsonb not null default '{}'::jsonb,
  file_path text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_cs_applications_status on public.cs_applications(status);
create index if not exists idx_donors_phone on public.donors(phone_normalized);
create index if not exists idx_donations_status_date on public.donations(status, transfer_date);
create index if not exists idx_donations_campaign on public.donations(campaign_id);
create index if not exists idx_donations_cs on public.donations(cs_id);
create index if not exists idx_expenses_status_date on public.expenses(status, expense_date);
create index if not exists idx_fund_movements_bucket on public.fund_movements(fund_bucket_id);
create index if not exists idx_audit_logs_actor_created on public.audit_logs(actor_id, created_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','cs_applications','cs_profiles','campaigns','donors','commission_records',
    'commission_payouts','leaderboard_periods','leaderboard_rewards','accounts',
    'fund_buckets','expenses','system_settings'
  ] loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', table_name, table_name);
    execute format('create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

create or replace function public.current_app_role()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'viewer')
$$;

create or replace function public.has_app_role(allowed text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.current_app_role() = any(allowed)
$$;

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.cs_applications enable row level security;
alter table public.cs_profiles enable row level security;
alter table public.donors enable row level security;
alter table public.donor_followups enable row level security;
alter table public.campaigns enable row level security;
alter table public.donations enable row level security;
alter table public.donation_proofs enable row level security;
alter table public.donation_allocations enable row level security;
alter table public.commission_records enable row level security;
alter table public.commission_payouts enable row level security;
alter table public.leaderboard_periods enable row level security;
alter table public.leaderboard_rewards enable row level security;
alter table public.accounts enable row level security;
alter table public.fund_buckets enable row level security;
alter table public.expenses enable row level security;
alter table public.fund_movements enable row level security;
alter table public.audit_logs enable row level security;
alter table public.system_settings enable row level security;
alter table public.reports enable row level security;

drop policy if exists "roles readable by authenticated" on public.roles;
create policy "roles readable by authenticated" on public.roles for select to authenticated using (true);

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_app_role(array['super_admin','admin']));
drop policy if exists "profiles admin manage" on public.profiles;
create policy "profiles admin manage" on public.profiles for all to authenticated using (public.has_app_role(array['super_admin','admin'])) with check (public.has_app_role(array['super_admin','admin']));

drop policy if exists "campaign public read active" on public.campaigns;
create policy "campaign public read active" on public.campaigns for select to anon, authenticated using (status in ('active','completed'));
drop policy if exists "campaign admin manage" on public.campaigns;
create policy "campaign admin manage" on public.campaigns for all to authenticated using (public.has_app_role(array['super_admin','admin','finance'])) with check (public.has_app_role(array['super_admin','admin','finance']));

drop policy if exists "cs application insert own" on public.cs_applications;
create policy "cs application insert own" on public.cs_applications for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "cs application read own or admin" on public.cs_applications;
create policy "cs application read own or admin" on public.cs_applications for select to authenticated using (user_id = auth.uid() or public.has_app_role(array['super_admin','admin']));
drop policy if exists "cs application admin update" on public.cs_applications;
create policy "cs application admin update" on public.cs_applications for update to authenticated using (public.has_app_role(array['super_admin','admin'])) with check (public.has_app_role(array['super_admin','admin']));

drop policy if exists "cs profile read limited" on public.cs_profiles;
create policy "cs profile read limited" on public.cs_profiles for select to authenticated using (user_id = auth.uid() or public.has_app_role(array['super_admin','admin','finance','viewer']));
drop policy if exists "cs profile admin manage" on public.cs_profiles;
create policy "cs profile admin manage" on public.cs_profiles for all to authenticated using (public.has_app_role(array['super_admin','admin'])) with check (public.has_app_role(array['super_admin','admin']));

drop policy if exists "donor read by owner or admin" on public.donors;
create policy "donor read by owner or admin" on public.donors for select to authenticated using (public.has_app_role(array['super_admin','admin','finance','verifier']) or exists (select 1 from public.cs_profiles c where c.id = donors.cs_id and c.user_id = auth.uid()));
drop policy if exists "donor create authenticated" on public.donors;
create policy "donor create authenticated" on public.donors for insert to authenticated with check (true);
drop policy if exists "donor update owner or admin" on public.donors;
create policy "donor update owner or admin" on public.donors for update to authenticated using (public.has_app_role(array['super_admin','admin']) or exists (select 1 from public.cs_profiles c where c.id = donors.cs_id and c.user_id = auth.uid())) with check (public.has_app_role(array['super_admin','admin']) or exists (select 1 from public.cs_profiles c where c.id = donors.cs_id and c.user_id = auth.uid()));

drop policy if exists "donation read by role or cs owner" on public.donations;
create policy "donation read by role or cs owner" on public.donations for select to authenticated using (public.has_app_role(array['super_admin','admin','finance','verifier']) or exists (select 1 from public.cs_profiles c where c.id = donations.cs_id and c.user_id = auth.uid()));
drop policy if exists "donation create authenticated" on public.donations;
create policy "donation create authenticated" on public.donations for insert to authenticated with check (true);
drop policy if exists "donation verify role update" on public.donations;
create policy "donation verify role update" on public.donations for update to authenticated using (public.has_app_role(array['super_admin','admin','finance','verifier'])) with check (public.has_app_role(array['super_admin','admin','finance','verifier']));

drop policy if exists "financial read privileged" on public.expenses;
create policy "financial read privileged" on public.expenses for select to authenticated using (public.has_app_role(array['super_admin','admin','finance','viewer']));
drop policy if exists "financial manage privileged" on public.expenses;
create policy "financial manage privileged" on public.expenses for all to authenticated using (public.has_app_role(array['super_admin','admin','finance'])) with check (public.has_app_role(array['super_admin','admin','finance']));

drop policy if exists "finance supporting read" on public.fund_buckets;
create policy "finance supporting read" on public.fund_buckets for select to authenticated using (public.has_app_role(array['super_admin','admin','finance','viewer']));
drop policy if exists "finance supporting manage" on public.fund_buckets;
create policy "finance supporting manage" on public.fund_buckets for all to authenticated using (public.has_app_role(array['super_admin','admin','finance'])) with check (public.has_app_role(array['super_admin','admin','finance']));

drop policy if exists "audit insert authenticated" on public.audit_logs;
create policy "audit insert authenticated" on public.audit_logs for insert to authenticated with check (true);
drop policy if exists "audit read admin" on public.audit_logs;
create policy "audit read admin" on public.audit_logs for select to authenticated using (public.has_app_role(array['super_admin','admin']));

-- Kebijakan umum untuk tabel laporan, komisi, leaderboard, alokasi, bukti, dan follow-up.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'donor_followups','donation_proofs','donation_allocations','commission_records',
    'commission_payouts','leaderboard_periods','leaderboard_rewards','accounts',
    'fund_movements','system_settings','reports'
  ] loop
    execute format('drop policy if exists "%s privileged read" on public.%I', tbl, tbl);
    execute format('create policy "%s privileged read" on public.%I for select to authenticated using (public.has_app_role(array[''super_admin'',''admin'',''finance'',''viewer'']))', tbl, tbl);
    execute format('drop policy if exists "%s privileged manage" on public.%I', tbl, tbl);
    execute format('create policy "%s privileged manage" on public.%I for all to authenticated using (public.has_app_role(array[''super_admin'',''admin'',''finance''])) with check (public.has_app_role(array[''super_admin'',''admin'',''finance'']))', tbl, tbl);
  end loop;
end;
$$;

-- Private storage buckets. Buat signed URL dari server/Edge Function untuk file sensitif.
insert into storage.buckets (id, name, public) values
  ('wbs-proofs','wbs-proofs',false),
  ('wbs-ktp','wbs-ktp',false),
  ('wbs-reports','wbs-reports',false)
on conflict (id) do nothing;

grant usage on schema public to anon, authenticated;
grant select on public.roles to authenticated;
grant select on public.campaigns to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;
