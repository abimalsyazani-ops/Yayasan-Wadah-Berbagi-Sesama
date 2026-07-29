# Migrasi Supabase WBS

Website sudah disiapkan untuk membaca dan menyimpan data ke Supabase project:

- URL: `https://tnwnmotbjhdefkzsdpuj.supabase.co`
- Publishable key: sudah dipasang di `assets/data-store.js`
- SQL migrasi: `supabase/wbs_supabase_migration.sql`
- Schema Finance CRM: `supabase-schema.sql`

> Catatan 2026: Supabase Data API membutuhkan grant dan RLS policy yang jelas agar tabel bisa diakses melalui API. File schema terbaru sudah menambahkan grant dasar dan policy RLS.

## Cara Menjalankan Migrasi

1. Buka Supabase Dashboard project `tnwnmotbjhdefkzsdpuj`.
2. Masuk ke menu `SQL Editor`.
3. Buka file `supabase/wbs_supabase_migration.sql`.
4. Jalankan seluruh SQL.
5. Untuk fondasi WBS Finance CRM, jalankan juga `supabase-schema.sql`.
6. Setelah berhasil, ubah `APP_MODE` di `assets/data-store.js` menjadi `"production"`.
7. Buat akun admin pertama melalui Supabase Auth.
8. Isi tabel `profiles` untuk user admin pertama dengan role `super_admin`.
9. Refresh website.

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

## Admin Pertama

1. Buka Supabase Dashboard.
2. Masuk ke Authentication → Users.
3. Tambahkan user admin.
4. Ambil UUID user tersebut.
5. Jalankan SQL berikut dengan mengganti nilainya:

```sql
insert into public.profiles (id, email, full_name, role)
values ('UUID_USER_ADMIN', 'admin@example.com', 'Admin WBS', 'super_admin')
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
```

## Bucket Storage

Pastikan bucket berikut privat:

- `wbs-proofs`
- `wbs-ktp`
- `wbs-reports`

Gunakan signed URL atau Edge Function saat nanti membuka file sensitif seperti KTP dan bukti transaksi.
