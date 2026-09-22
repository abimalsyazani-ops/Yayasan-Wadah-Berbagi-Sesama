# Migrasi Supabase WBS

Website sudah disiapkan untuk membaca dan menyimpan data ke Supabase project:

- URL: `https://tnwnmotbjhdefkzsdpuj.supabase.co`
- Publishable key: sudah dipasang di `assets/data-store.js`
- SQL migrasi: `supabase/wbs_supabase_migration.sql`
- SQL pembaruan donasi buku: `supabase/book_donations_update.sql`
- Schema Finance CRM: `supabase-schema.sql`

> Catatan 2026: Supabase Data API membutuhkan grant dan RLS policy yang jelas agar tabel bisa diakses melalui API. File schema terbaru sudah menambahkan grant dasar dan policy RLS.

## Cara Menjalankan Migrasi

1. Buka Supabase Dashboard project `tnwnmotbjhdefkzsdpuj`.
2. Masuk ke menu `SQL Editor`.
3. Untuk project yang sudah pernah dimigrasikan, buka dan jalankan `supabase/book_donations_update.sql`.
4. Untuk instalasi baru, jalankan seluruh isi `supabase/wbs_supabase_migration.sql` (pembaruan donasi buku sudah termasuk di dalamnya).
5. Untuk fondasi WBS Finance CRM, jalankan juga `supabase-schema.sql`.
6. Pastikan `APP_MODE` di `assets/data-store.js` bernilai `"production"` (sudah aktif pada versi terbaru).
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
- `book_donations`
- `donors`
- `messages`

## Perilaku Website

- Website tetap memiliki fallback data lokal agar tidak kosong jika Supabase belum siap.
- Setelah tabel Supabase tersedia, website akan mengambil data dari Supabase dan memperbarui tampilan.
- Form publik seperti donasi, relawan, donasi buku, dan kontak menunggu konfirmasi Supabase sebelum menampilkan pesan berhasil.
- Dashboard admin memuat ulang data Supabase setelah login dan menyediakan tombol WhatsApp, Email, serta Konfirmasi untuk tindak lanjut.
- Data artikel, campaign, dokumen, galeri, dan video disiapkan sebagai tabel terpisah agar mudah dikelola dan dimigrasikan.

## Keamanan

SQL migrasi sudah mengaktifkan Row Level Security.

- Konten publik (`programs`, `campaigns`, `articles`, `gallery`, `videos`, `documents`) bisa dibaca publik.
- Data sensitif (`donors`, `volunteers`, `book_donations`, `messages`) hanya menerima insert dari publik, tetapi tidak bisa dibaca publik.
- Akses kelola penuh disiapkan untuk role `authenticated`.

Dashboard admin menggunakan Supabase Auth agar data dapat dikelola lintas perangkat.

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
