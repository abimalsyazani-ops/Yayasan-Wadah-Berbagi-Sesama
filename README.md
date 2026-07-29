# WBS Website & Admin Foundation

Website ini adalah fondasi publik dan admin untuk Yayasan Wadah Berbagi Sesama. Perbaikan tahap ini difokuskan pada stabilitas fungsi, validasi data, penyimpanan, keamanan dasar, dan kesiapan migrasi menuju WBS Finance CRM tanpa mengubah tampilan visual yang sudah ada.

## Status mode aplikasi

Saat ini file berjalan dalam:

```js
const APP_MODE = "demo";
```

Lokasi: `assets/data-store.js`

Mode `demo` memakai `localStorage` untuk pengujian lokal. Mode ini tidak aman untuk data keuangan produksi, tetapi data tetap tersimpan setelah refresh browser.

Mode `production` disiapkan untuk Supabase Auth, Database, Storage, dan Row Level Security. Ubah `APP_MODE` ke `"production"` setelah schema dan konfigurasi Supabase selesai.

## Cara menjalankan lokal

Jika Node.js tersedia:

```bash
node dev-server.js
```

Lalu buka:

```text
http://127.0.0.1:8765/
```

Halaman admin:

```text
http://127.0.0.1:8765/admin.html
```

Jika tidak memakai server lokal, file HTML tetap bisa dibuka langsung, tetapi beberapa fitur browser modern lebih stabil melalui `http://127.0.0.1`.

## Admin demo

Tidak ada email atau password default di source code.

Langkah membuat admin demo:

1. Buka `admin.html`.
2. Klik `Daftar Admin Baru`.
3. Masukkan email dan kata sandi minimal 8 karakter.
4. Login dengan akun tersebut.

Catatan: akun demo tersimpan di browser/perangkat tersebut saja. Untuk produksi gunakan Supabase Auth.

## Konfigurasi Supabase production

1. Buat project Supabase.
2. Jalankan file `supabase-schema.sql` di SQL Editor.
3. Jika tetap memakai tabel website lama, jalankan juga `supabase/wbs_supabase_migration.sql`.
4. Buat user admin pertama di Supabase Auth.
5. Tambahkan data `profiles` untuk user tersebut dengan role `super_admin`.
6. Pastikan RLS aktif.
7. Pastikan bucket storage berikut tersedia dan privat:
   - `wbs-proofs`
   - `wbs-ktp`
   - `wbs-reports`
8. Ubah `APP_MODE` menjadi `"production"` di `assets/data-store.js`.

## Perbaikan yang sudah diterapkan

- Session admin demo tidak lagi berupa string `active`.
- Login production memakai jalur `supabase.auth.signInWithPassword()`.
- Pemeriksaan session production memakai `supabase.auth.getSession()`.
- Logout production memakai `supabase.auth.signOut()`.
- Tidak ada password admin hardcoded.
- Validasi form admin diperketat.
- Validasi file admin: ukuran maksimal 1,25 MB, tipe file dibatasi.
- Submit form dikunci saat proses berjalan agar tidak tersimpan ganda.
- Ekspor CSV donatur dilindungi dari formula injection Excel.
- Donasi publik divalidasi: nama, telepon, email, kota, nominal, metode pembayaran.
- Pencegahan submit donasi ganda dalam waktu singkat.
- Progress campaign menghitung donasi yang tersimpan.
- Persentase campaign aman dari pembagian nol.
- Penyimpanan repository lokal menangani update berdasarkan ID.
- Audit log internal tersimpan di `localStorage`.
- Server lokal menambahkan header `X-Content-Type-Options` dan `Referrer-Policy`.

## File penting

- `index.html` — halaman utama.
- `admin.html` — dashboard admin.
- `assets/app.js` — logika halaman publik.
- `assets/admin.js` — logika dashboard admin.
- `assets/data-store.js` — repository data, mode aplikasi, Supabase sync.
- `supabase-schema.sql` — fondasi schema WBS Finance CRM.
- `supabase/wbs_supabase_migration.sql` — schema website publik lama.
- `TESTING.md` — skenario dan hasil uji.
- `WBS-Website.zip` — paket siap dibagikan setelah proses zip ulang.

## Batasan tahap ini

Fitur CRM penuh seperti OCR bukti transfer, webhook payment gateway, multi-user realtime, Edge Functions, dan role enforcement produksi membutuhkan konfigurasi Supabase aktif dan implementasi backend tambahan. Fondasinya sudah disiapkan di schema agar bisa dilanjutkan bertahap.
