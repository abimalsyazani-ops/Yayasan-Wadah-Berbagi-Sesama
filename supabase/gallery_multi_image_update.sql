begin;

alter table public.gallery
  add column if not exists images jsonb default '[]'::jsonb;

update public.gallery
set images = case
  when image is not null and btrim(image) <> '' then jsonb_build_array(image)
  else '[]'::jsonb
end
where images is null
   or jsonb_typeof(images) <> 'array'
   or (jsonb_array_length(images) = 0 and image is not null and btrim(image) <> '');

alter table public.gallery
  alter column images set default '[]'::jsonb,
  alter column images set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.gallery'::regclass
      and conname = 'gallery_images_is_array'
  ) then
    alter table public.gallery
      add constraint gallery_images_is_array
      check (jsonb_typeof(images) = 'array');
  end if;
end
$$;

notify pgrst, 'reload schema';

commit;
