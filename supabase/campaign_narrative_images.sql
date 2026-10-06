-- Add up to two supporting images to each campaign narrative.
alter table public.campaigns
  add column if not exists "narrativeImages" jsonb not null default '[]'::jsonb;

alter table public.campaigns
  drop constraint if exists campaigns_narrative_images_count;

alter table public.campaigns
  add constraint campaigns_narrative_images_count check (
    jsonb_typeof("narrativeImages") = 'array'
    and jsonb_array_length("narrativeImages") <= 2
  );

notify pgrst, 'reload schema';
