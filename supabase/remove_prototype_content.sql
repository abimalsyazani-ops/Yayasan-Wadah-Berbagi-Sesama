begin;

delete from public.programs
where id in (
  'sosial-yatim', 'sosial-bencana', 'sosial-dhuafa',
  'pendidikan-beasiswa', 'pendidikan-tahfidz', 'pendidikan-belajar',
  'kesehatan-gratis', 'kesehatan-pengobatan', 'kesehatan-gizi',
  'pangan-sembako', 'pangan-jumat', 'pangan-ramadhan'
);

delete from public.campaigns
where id in ('zakat-maal', 'sedekah-yatim', 'wakaf-quran', 'beasiswa-yatim', 'pangan-lansia', 'pengobatan-dhuafa');

delete from public.articles
where id in ('pangan-ramadhan-2026', 'keutamaan-sedekah', 'wakaf-produktif', 'adab-memberi');

delete from public.gallery
where id in ('gal-1', 'gal-2', 'gal-3', 'gal-4', 'gal-5', 'gal-6');

delete from public.videos
where id in ('vid-1', 'vid-2', 'vid-3');

delete from public.volunteers
where id = 'VOL-1790650957327-1f1c96';

delete from public.donors
where id = 'DON-1790651080590-62b446';

commit;
