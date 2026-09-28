begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "Admins can verify own access" on public.admin_users;
create policy "Admins can verify own access"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

insert into public.admin_users (user_id, email)
select id, lower(email)
from auth.users
where lower(email) in ('farahbintang03@gmail.com', 'legaltechagency@gmail.com')
on conflict (user_id) do update set email = excluded.email;

revoke all on table public.programs, public.campaigns, public.articles, public.gallery, public.videos from anon, authenticated;
grant select on table public.programs, public.campaigns, public.articles, public.gallery, public.videos to anon;
grant select, insert, update, delete on table public.programs, public.campaigns, public.articles, public.gallery, public.videos to authenticated;

revoke all on table public.volunteers, public.book_donations, public.donors, public.messages from anon, authenticated;
grant insert on table public.volunteers, public.book_donations, public.donors, public.messages to anon;
grant select, insert, update, delete on table public.volunteers, public.book_donations, public.donors, public.messages to authenticated;

drop policy if exists "Public read documents" on public.documents;
drop policy if exists "Authenticated manage documents" on public.documents;
revoke all on table public.documents from anon, authenticated;
grant select, insert, update, delete on table public.documents to authenticated;

drop policy if exists "Authenticated manage programs" on public.programs;
drop policy if exists "Authenticated manage campaigns" on public.campaigns;
drop policy if exists "Authenticated manage articles" on public.articles;
drop policy if exists "Authenticated manage gallery" on public.gallery;
drop policy if exists "Authenticated manage videos" on public.videos;
drop policy if exists "Authenticated manage volunteers" on public.volunteers;
drop policy if exists "Authenticated manage book donations" on public.book_donations;
drop policy if exists "Authenticated manage donors" on public.donors;
drop policy if exists "Authenticated manage messages" on public.messages;

create policy "Admins manage programs" on public.programs for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage campaigns" on public.campaigns for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage articles" on public.articles for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage gallery" on public.gallery for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage videos" on public.videos for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage documents" on public.documents for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage volunteers" on public.volunteers for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage book donations" on public.book_donations for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage donors" on public.donors for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins manage messages" on public.messages for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "Authenticated upload website media" on storage.objects;
drop policy if exists "Authenticated read website media" on storage.objects;
drop policy if exists "Authenticated update website media" on storage.objects;
drop policy if exists "Authenticated delete website media" on storage.objects;

create policy "Admins upload website media" on storage.objects for insert to authenticated
with check (bucket_id = 'website-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins read website media" on storage.objects for select to authenticated
using (bucket_id = 'website-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins update website media" on storage.objects for update to authenticated
using (bucket_id = 'website-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (bucket_id = 'website-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admins delete website media" on storage.objects for delete to authenticated
using (bucket_id = 'website-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

commit;
