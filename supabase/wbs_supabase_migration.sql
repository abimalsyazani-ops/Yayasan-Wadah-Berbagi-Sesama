-- Supabase migration for Yayasan Wadah Berbagi Sesama (WBS)
-- Run this in Supabase SQL Editor for project tnwnmotbjhdefkzsdpuj.
-- It creates website data tables, enables RLS, grants Data API access, and seeds prototype content.

create table if not exists public.programs (id text primary key, category text not null, title text not null, description text, image text, "createdAt" timestamptz default now());
create table if not exists public.campaigns (id text primary key, category text not null, title text not null, description text, collected numeric default 0, target numeric default 0, deadline date, image text, featured boolean default false, "createdAt" timestamptz default now());
create table if not exists public.articles (id text primary key, category text not null, title text not null, date date, excerpt text, image text, content text, "createdAt" timestamptz default now());
create table if not exists public.gallery (id text primary key, title text not null, category text, date date, image text, "createdAt" timestamptz default now());
create table if not exists public.videos (id text primary key, title text not null, category text, date date, url text not null, thumbnail text, "createdAt" timestamptz default now());
create table if not exists public.documents (id text primary key, category text, title text not null, period text, url text, "fileName" text, "fileType" text, "fileData" text, "createdAt" timestamptz default now());
create table if not exists public.volunteers (id text primary key, name text, phone text, email text, city text, role text, availability text, message text, status text default 'Baru', "createdAt" timestamptz default now());
create table if not exists public.donors (id text primary key, salutation text, name text, "publicName" text, phone text, email text, city text, prayer text, anonymous boolean default false, campaign text, amount numeric, "paymentMethod" text, status text default 'Menunggu Konfirmasi', "createdAt" timestamptz default now());
create table if not exists public.messages (id text primary key, name text, email text, phone text, subject text, message text, status text default 'Baru', "createdAt" timestamptz default now());

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

-- Seed prototype website content.
insert into public.programs ("id", "category", "title", "description", "image") values ('sosial-yatim', 'sosial', 'Santunan dan Pembinaan Anak Yatim', 'Pendampingan rutin, santunan, dan pembinaan karakter bagi anak yatim.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('sosial-bencana', 'sosial', 'Tanggap Bencana', 'Bantuan cepat untuk masyarakat terdampak bencana dan keadaan darurat.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('sosial-dhuafa', 'sosial', 'Pendampingan Keluarga Dhuafa', 'Bantuan kebutuhan dasar dan pendampingan menuju kemandirian.', 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pendidikan-beasiswa', 'pendidikan', 'Beasiswa Anak Yatim', 'Dukungan biaya sekolah bagi anak yatim dan dhuafa berprestasi.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pendidikan-tahfidz', 'pendidikan', 'Rumah Tahfidz Al-Qur''an', 'Pembinaan generasi penghafal Al-Qur''an dengan kurikulum terarah.', 'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pendidikan-belajar', 'pendidikan', 'Rumah Belajar WBS', 'Ruang belajar gratis, literasi, dan pendampingan akademik.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('kesehatan-gratis', 'kesehatan', 'Layanan Kesehatan Gratis', 'Pemeriksaan dan pengobatan dasar bagi masyarakat prasejahtera.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('kesehatan-pengobatan', 'kesehatan', 'Bantuan Biaya Pengobatan', 'Dukungan pengobatan untuk pasien dhuafa dengan kondisi mendesak.', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('kesehatan-gizi', 'kesehatan', 'Gizi Ibu dan Anak', 'Paket gizi dan edukasi kesehatan untuk keluarga rentan.', 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pangan-sembako', 'pangan', 'Paket Sembako Dhuafa', 'Distribusi pangan pokok rutin bagi keluarga prasejahtera.', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pangan-jumat', 'pangan', 'Jumat Berbagi', 'Makanan siap santap untuk yatim, pekerja informal, dan dhuafa.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.programs ("id", "category", "title", "description", "image") values ('pangan-ramadhan', 'pangan', 'Pangan Ramadhan', 'Paket sahur, berbuka, dan sembako selama bulan Ramadhan.', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "image" = excluded."image";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image", "featured") values ('zakat-maal', 'Zakat', 'Zakat Maal untuk Keluarga Dhuafa', 'Salurkan zakat maal untuk membantu keluarga dhuafa memenuhi kebutuhan dasar dan membangun kemandirian.', 0, 150000000, '2026-07-09', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80', true) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image", "featured" = excluded."featured";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image", "featured") values ('sedekah-yatim', 'Sedekah', 'Sedekah Makan Anak Yatim Setiap Jumat', 'Hadirkan makanan bergizi dan kebahagiaan bagi anak yatim setiap Jumat.', 0, 75000000, null, 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80', true) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image", "featured" = excluded."featured";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image") values ('wakaf-quran', 'Wakaf', 'Wakaf Al-Qur''an dan Rumah Tahfidz', 'Dukung penyediaan Al-Qur''an dan pengembangan rumah tahfidz.', 0, 250000000, '2026-07-22', 'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=900&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image") values ('beasiswa-yatim', 'Pendidikan', 'Beasiswa Pendidikan Anak Yatim 2026', 'Bantu anak yatim melanjutkan pendidikan dan meraih masa depan lebih baik.', 0, 200000000, '2026-07-16', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image") values ('pangan-lansia', 'Pangan', 'Paket Sembako untuk Lansia dan Dhuafa', 'Penuhi kebutuhan pangan pokok lansia dan keluarga prasejahtera.', 0, 120000000, '2026-07-03', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image";
insert into public.campaigns ("id", "category", "title", "description", "collected", "target", "deadline", "image") values ('pengobatan-dhuafa', 'Kesehatan', 'Bantuan Pengobatan Pasien Dhuafa', 'Ringankan biaya pengobatan pasien dhuafa dengan kondisi mendesak.', 0, 150000000, '2026-08-01', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900&q=80') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "deadline" = excluded."deadline", "image" = excluded."image";
insert into public.articles ("id", "category", "title", "date", "excerpt", "image", "content") values ('pangan-ramadhan-2026', 'Kegiatan Yayasan', 'WBS Salurkan 50.000 Paket Pangan Selama Ramadhan', '2026-06-12', 'Kolaborasi donatur dan relawan menghadirkan paket pangan bagi keluarga di berbagai wilayah.', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80', 'Yayasan Wadah Berbagi Sesama menyalurkan paket pangan selama Ramadhan kepada keluarga prasejahtera, lansia, dan anak yatim. Setiap penyaluran didahului verifikasi penerima manfaat dan didokumentasikan oleh tim lapangan.

Program ini menjadi bagian dari komitmen WBS untuk menjaga ketahanan pangan sekaligus memperluas kolaborasi kebaikan.') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "date" = excluded."date", "excerpt" = excluded."excerpt", "image" = excluded."image", "content" = excluded."content";
insert into public.articles ("id", "category", "title", "date", "excerpt", "image", "content") values ('keutamaan-sedekah', 'Edukasi Sedekah', 'Keutamaan Sedekah di Bulan-Bulan Mulia', '2026-06-08', 'Sedekah menjadi jalan sederhana untuk menumbuhkan kepedulian dan kebermanfaatan.', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&q=80', 'Sedekah mengajarkan kepedulian, rasa syukur, dan tanggung jawab sosial. Nilainya tidak hanya terletak pada jumlah, tetapi juga pada ketulusan dan ketepatan manfaat.

WBS mendorong masyarakat memilih program yang jelas, terukur, dan dilaporkan secara terbuka.') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "date" = excluded."date", "excerpt" = excluded."excerpt", "image" = excluded."image", "content" = excluded."content";
insert into public.articles ("id", "category", "title", "date", "excerpt", "image", "content") values ('wakaf-produktif', 'Edukasi Wakaf', 'Mengenal Wakaf Produktif dan Manfaatnya bagi Umat', '2026-06-02', 'Wakaf produktif memungkinkan manfaat aset terus tumbuh dan dirasakan masyarakat.', 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=900&q=80', 'Wakaf produktif dikelola agar aset pokok tetap terjaga sementara hasilnya mendukung kebutuhan umat. Pengelolaan yang profesional membutuhkan tata kelola, pelaporan, dan evaluasi berkala.

Melalui program wakaf, WBS berupaya menghadirkan manfaat jangka panjang untuk pendidikan, air bersih, dan pemberdayaan.') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "date" = excluded."date", "excerpt" = excluded."excerpt", "image" = excluded."image", "content" = excluded."content";
insert into public.articles ("id", "category", "title", "date", "excerpt", "image", "content") values ('adab-memberi', 'Artikel Islami', 'Adab Memberi dalam Islam yang Perlu Diteladani', '2026-05-28', 'Memberi dengan santun menjaga kehormatan penerima dan ketulusan pemberi.', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=900&q=80', 'Kebaikan perlu disampaikan dengan cara yang baik. Menjaga privasi, tidak menyakiti perasaan, dan memilih penyaluran yang tepat merupakan bagian penting dari adab memberi.

WBS menjaga dokumentasi program tanpa mengurangi martabat penerima manfaat.') on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "date" = excluded."date", "excerpt" = excluded."excerpt", "image" = excluded."image", "content" = excluded."content";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-1', 'Distribusi Paket Pangan', 'Pangan', '2026-06-12', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-2', 'Kegiatan Belajar Anak', 'Pendidikan', '2026-06-06', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-3', 'Pemeriksaan Kesehatan', 'Kesehatan', '2026-05-28', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-4', 'Pembinaan Anak Yatim', 'Sosial', '2026-05-20', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-5', 'Relawan WBS di Lapangan', 'Relawan', '2026-05-14', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.gallery ("id", "title", "category", "date", "image") values ('gal-6', 'Program Gizi Keluarga', 'Pangan', '2026-05-04', 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1000&q=80') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "image" = excluded."image";
insert into public.videos ("id", "title", "category", "date", "url") values ('vid-1', 'Dokumentasi Kegiatan WBS', 'Dokumentasi', '2026-06-20', 'https://www.youtube.com/watch?v=ysz5S6PUM-U') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "url" = excluded."url";
insert into public.videos ("id", "title", "category", "date", "url") values ('vid-2', 'Cerita Relawan WBS', 'Relawan', '2026-06-14', 'https://youtu.be/ysz5S6PUM-U') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "url" = excluded."url";
insert into public.videos ("id", "title", "category", "date", "url") values ('vid-3', 'Penyaluran Bantuan Pangan', 'Pangan', '2026-06-08', 'https://www.youtube.com/watch?v=ysz5S6PUM-U') on conflict (id) do update set "title" = excluded."title", "category" = excluded."category", "date" = excluded."date", "url" = excluded."url";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-kegiatan', 'Laporan Kegiatan', 'Laporan Kegiatan Yayasan', 'Diperbarui berkala', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Kegiatan%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-penyaluran', 'Laporan Penyaluran', 'Laporan Penyaluran Bantuan', 'Diperbarui berkala', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Penyaluran%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-dokumentasi', 'Dokumentasi Program', 'Dokumentasi Pelaksanaan Program', 'Diperbarui berkala', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Dokumentasi%20Program%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-keuangan', 'Penggunaan Dana', 'Laporan Penggunaan Dana', 'Diperbarui berkala', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Penggunaan%20Dana%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-tahunan', 'Laporan Tahunan', 'Laporan Tahunan Yayasan', 'Tahunan', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Tahunan%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
insert into public.documents ("id", "category", "title", "period", "url", "fileName") values ('doc-legal', 'Legalitas', 'SK Kemenkumham dan NIB Yayasan', 'Tahun 2025', 'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Legalitas%20WBS', null) on conflict (id) do update set "category" = excluded."category", "title" = excluded."title", "period" = excluded."period", "url" = excluded."url", "fileName" = excluded."fileName";
