begin;

-- Proyeksi publik ini sengaja tidak menyimpan nomor telepon, email, kota,
-- metode pembayaran, atau data administratif donatur lainnya.
create table if not exists public.donation_activity (
  id text primary key,
  campaign text not null,
  "publicName" text not null default 'Hamba Allah',
  anonymous boolean not null default false,
  amount numeric not null default 0 check (amount >= 0),
  prayer text,
  "createdAt" timestamptz not null default now()
);

alter table public.donation_activity enable row level security;
revoke all on table public.donation_activity from anon, authenticated;
grant select on table public.donation_activity to anon, authenticated;

drop policy if exists "Public read confirmed donation activity" on public.donation_activity;
create policy "Public read confirmed donation activity"
on public.donation_activity for select
to anon, authenticated
using (true);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.sync_donation_activity()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.donation_activity where id = old.id;
    return old;
  end if;

  if new.status in ('verified', 'approved', 'posted') then
    insert into public.donation_activity (
      id, campaign, "publicName", anonymous, amount, prayer, "createdAt"
    ) values (
      new.id,
      new.campaign,
      case
        when coalesce(new.anonymous, false) then 'Hamba Allah'
        else coalesce(nullif(btrim(new."publicName"), ''), 'Donatur WBS')
      end,
      coalesce(new.anonymous, false),
      greatest(coalesce(new.amount, 0), 0),
      nullif(btrim(new.prayer), ''),
      coalesce(new."createdAt", now())
    )
    on conflict (id) do update set
      campaign = excluded.campaign,
      "publicName" = excluded."publicName",
      anonymous = excluded.anonymous,
      amount = excluded.amount,
      prayer = excluded.prayer,
      "createdAt" = excluded."createdAt";
  else
    delete from public.donation_activity where id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function private.sync_donation_activity() from public, anon, authenticated;

drop trigger if exists sync_donation_activity_after_write on public.donors;
create trigger sync_donation_activity_after_write
after insert or update or delete on public.donors
for each row execute function private.sync_donation_activity();

-- Memasukkan donasi lama yang sudah dikonfirmasi sebelum trigger tersedia.
insert into public.donation_activity (
  id, campaign, "publicName", anonymous, amount, prayer, "createdAt"
)
select
  id,
  campaign,
  case
    when coalesce(anonymous, false) then 'Hamba Allah'
    else coalesce(nullif(btrim("publicName"), ''), 'Donatur WBS')
  end,
  coalesce(anonymous, false),
  greatest(coalesce(amount, 0), 0),
  nullif(btrim(prayer), ''),
  coalesce("createdAt", now())
from public.donors
where status in ('verified', 'approved', 'posted')
on conflict (id) do update set
  campaign = excluded.campaign,
  "publicName" = excluded."publicName",
  anonymous = excluded.anonymous,
  amount = excluded.amount,
  prayer = excluded.prayer,
  "createdAt" = excluded."createdAt";

notify pgrst, 'reload schema';

commit;
