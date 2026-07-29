# Migrasi Supabase WBS

Website sudah disiapkan untuk membaca dan menyimpan data ke Supabase project:

- URL: `https://tnwnmotbjhdefkzsdpuj.supabase.co`
- Publishable key: sudah dipasang di `assets/data-store.js`
- SQL migrasi: `supabase/wbs_supabase_migration.sql`

## Cara Menjalankan Migrasi

1. Buka Supabase Dashboard project `tnwnmotbjhdefkzsdpuj`.
2. Masuk ke menu `SQL Editor`.
3. Buka file `supabase/wbs_supabase_migration.sql`.
4. Jalankan seluruh SQL.
5. Setelah berhasil, refresh website.

## Tabel Yang Dibuat

- `programs`
- `campaigns`
- `articles`
- `gallery`
- `videos`
- `documents`
- `volunteers`
- `donors`
- `messages`

## Perilaku Website

- Website tetap memiliki fallback data lokal agar tidak kosong jika Supabase belum siap.
- Setelah tabel Supabase tersedia, website akan mengambil data dari Supabase dan memperbarui tampilan.
- Form publik seperti donasi, relawan, dan kontak akan mencoba menyimpan data ke Supabase.
- Data artikel, campaign, dokumen, galeri, dan video disiapkan sebagai tabel terpisah agar mudah dikelola dan dimigrasikan.

## Keamanan

SQL migrasi sudah mengaktifkan Row Level Security.

- Konten publik (`programs`, `campaigns`, `articles`, `gallery`, `videos`, `documents`) bisa dibaca publik.
- Data sensitif (`donors`, `volunteers`, `messages`) hanya menerima insert dari publik, tetapi tidak bisa dibaca publik.
- Akses kelola penuh disiapkan untuk role `authenticated`.

Untuk produksi, dashboard admin sebaiknya diganti dari login prototype lokal menjadi Supabase Auth agar pengelolaan data benar-benar aman lintas perangkat.