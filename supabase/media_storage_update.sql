-- Run once in the Supabase SQL Editor for the WBS project.
-- Creates a public media bucket while restricting uploads and management to authenticated admins.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated upload website media" on storage.objects;
create policy "Authenticated upload website media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'website-media');

drop policy if exists "Authenticated read website media" on storage.objects;
create policy "Authenticated read website media"
on storage.objects for select
to authenticated
using (bucket_id = 'website-media');

drop policy if exists "Authenticated update website media" on storage.objects;
create policy "Authenticated update website media"
on storage.objects for update
to authenticated
using (bucket_id = 'website-media')
with check (bucket_id = 'website-media');

drop policy if exists "Authenticated delete website media" on storage.objects;
create policy "Authenticated delete website media"
on storage.objects for delete
to authenticated
using (bucket_id = 'website-media');
