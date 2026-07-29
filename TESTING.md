# TESTING WBS Website & Admin Foundation

Tanggal uji: 2026-07-29  
Mode aplikasi: `demo`  
Lingkungan: lokal `http://127.0.0.1:8765/`

## Ringkasan hasil

| Area | Hasil |
| --- | --- |
| Syntax check JavaScript | Lulus |
| Audit aset HTML | Lulus |
| Static hardening test | 36/36 lulus |
| Browser smoke test | Lulus |
| Supabase production | Belum diuji end-to-end karena perlu project/akun production aktif |

## Uji otomatis

| Skenario | Hasil diharapkan | Hasil aktual | Status | Catatan |
| --- | --- | --- | --- | --- |
| `node --check assets/admin.js` | Tidak ada error sintaks | Tidak ada error | Lulus | Runtime Node bundled Codex |
| `node --check assets/app.js` | Tidak ada error sintaks | Tidak ada error | Lulus | Runtime Node bundled Codex |
| `node --check assets/data-store.js` | Tidak ada error sintaks | Tidak ada error | Lulus | Runtime Node bundled Codex |
| `node --check dev-server.js` | Tidak ada error sintaks | Tidak ada error | Lulus | Runtime Node bundled Codex |
| `node audit-site.js` | Tidak ada aset hilang, ID duplikat, link kosong | 19 halaman, 0 missing asset, 0 duplicate ID, 0 empty link | Lulus | Audit statis |
| `node test-site.js` | Hardening checks lulus | 36/36 lulus | Lulus | Auth, upload, CSV, schema, XSS pattern |

## Browser smoke test

| Skenario | Hasil diharapkan | Hasil aktual | Status | Catatan |
| --- | --- | --- | --- | --- |
| Buka halaman utama | Website tampil dan script aktif | Halaman terbuka, logo dan teks WBS tampil | Lulus | In-app browser |
| Buka halaman donasi | Campaign aktif tampil | 6 kartu campaign tampil | Lulus | Data dari seed/local repository |
| Klik Donasi Sekarang | Modal donasi terbuka | Modal terbuka | Lulus | Selector dinamis valid |
| Isi donasi valid Rp25.000 | Payment result tampil | Ringkasan pembayaran tampil | Lulus | UI menyimpan data dan menampilkan instruksi pembayaran |
| Buka `admin.html` tanpa login | Dashboard tidak terlihat | `loginView` terlihat, `dashboardView` tersembunyi | Lulus | Gate login aktif |
| Daftar/login admin demo | Dashboard admin terbuka | Dashboard admin tampil | Lulus | Tidak ada akun default hardcoded |
| Cek console error browser | Tidak ada error | Tidak ada console error | Lulus | Selama smoke test |

## Skenario validasi fungsi

| Skenario | Hasil diharapkan | Hasil aktual | Status | Catatan |
| --- | --- | --- | --- | --- |
| Nominal donasi kosong/nol | Ditolak | Validasi JS tersedia | Lulus statis | Perlu uji manual variasi input di browser |
| Nominal donasi valid | Diterima | Diterima pada smoke test | Lulus | Rp25.000 |
| Duplikasi submit donasi | Dicegah | Lock submit dan deteksi duplikasi tersedia | Lulus statis | Cek kode `dataset.busy` dan data sama 15 menit |
| Formula injection CSV | Teks diawali `= + - @` diamankan | Guard `safeCsvCell()` tersedia | Lulus statis | Export CSV donatur |
| Upload foto admin tipe salah | Ditolak | Validasi MIME tersedia | Lulus statis | JPG/PNG/WEBP |
| Upload dokumen tipe salah | Ditolak | Validasi MIME tersedia | Lulus statis | PDF/JPG/PNG/WEBP |
| Upload melebihi 1,25 MB | Ditolak | Validasi ukuran tersedia | Lulus statis | Mengikuti teks UI lama |
| XSS via data pengguna | Tidak dieksekusi sebagai HTML | Tidak ada `.innerHTML =` pada aset JS | Lulus statis | DOM memakai `textContent`/node builder |
| Session admin `active` | Tidak boleh dipakai | Tidak ditemukan pola session `active` | Lulus | Session demo memakai payload + hash |
| Supabase production login | `signInWithPassword()` tersedia | Fungsi tersedia | Lulus statis | Perlu akun Supabase nyata untuk uji live |
| Supabase production session | `getSession()` tersedia | Fungsi tersedia | Lulus statis | Perlu akun Supabase nyata untuk uji live |
| Supabase production logout | `signOut()` tersedia | Fungsi tersedia | Lulus statis | Perlu akun Supabase nyata untuk uji live |

## Skenario produksi yang masih membutuhkan konfigurasi

| Skenario | Alasan belum diuji penuh | Status |
| --- | --- | --- |
| Login setiap role Supabase | Membutuhkan user Auth dan data `profiles` untuk tiap role | Menunggu konfigurasi |
| RLS antar-role | Membutuhkan project Supabase production | Menunggu konfigurasi |
| Upload bukti ke Supabase Storage | Membutuhkan bucket privat dan implementasi endpoint/Storage client production | Menunggu konfigurasi |
| Webhook payment gateway | Membutuhkan endpoint publik dan secret gateway | Menunggu konfigurasi |
| OCR bukti transfer | Membutuhkan service OCR/Edge Function | Menunggu konfigurasi |
| Dua pengguna mengedit bersamaan | Membutuhkan multi-user production | Menunggu konfigurasi |

## Catatan

Tahap ini menguatkan fondasi website/admin yang sudah ada tanpa mengubah tampilan. Fitur CRM penuh dapat dilanjutkan bertahap menggunakan `supabase-schema.sql`.
