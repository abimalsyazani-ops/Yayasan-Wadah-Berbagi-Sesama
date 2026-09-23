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
| Upload foto admin tipe salah | Ditolak | Validasi MIME tersedia | Lulus | JPG/PNG/WEBP |
| Upload melebihi 8 MB | Ditolak | Validasi ukuran tersedia | Lulus | Foto hingga 8 MB dikompres otomatis sebelum upload |
| Upload foto produksi | Tersimpan di Supabase Storage | Bucket `website-media`, URL publik, dan kebijakan RLS aktif | Lulus | Artikel, campaign, dan album galeri |
| Cache data produksi | Tidak memenuhi `localStorage` | Pengujian mencatat 0 penulisan browser | Lulus | `node test-production-storage.js` |
| Cache browser versi lama | Dibersihkan setelah data server dimuat | Kunci data WBS lokal dihapus setelah sinkronisasi berhasil | Lulus | Sesi Supabase tetap dipertahankan |
| Gagal menyimpan ke server | Data lama dipulihkan | Rollback cache memori berhasil | Lulus | Tidak menampilkan sukses palsu |
| Form publik dengan publishable key | Header `apikey` tanpa Bearer JWT | Permintaan anonim tidak menghasilkan autentikasi JWT palsu | Lulus | Pesan, relawan, donasi buku, dan donasi |
| Cache PWA setelah deployment | JavaScript dimuat ulang dari jaringan | Cache hanya menyimpan aset dashboard admin dan versi lama dibersihkan | Lulus | Service worker v14 |
| XSS via data pengguna | Tidak dieksekusi sebagai HTML | Tidak ada `.innerHTML =` pada aset JS | Lulus statis | DOM memakai `textContent`/node builder |
| Session admin `active` | Tidak boleh dipakai | Tidak ditemukan pola session `active` | Lulus | Session demo memakai payload + hash |
| Supabase production login | Sesi autentikasi aktif | Login Google dan callback Vercel berhasil | Lulus live | Akun admin Supabase |
| Supabase production session | Dashboard membaca sesi | Dashboard admin tampil setelah callback | Lulus live | `getSession()` dan `onAuthStateChange()` |
| Supabase production logout | `signOut()` tersedia | Fungsi tersedia | Lulus statis | Tidak dijalankan agar sesi uji tetap aktif |

## Skenario produksi yang masih membutuhkan konfigurasi

| Skenario | Alasan belum diuji penuh | Status |
| --- | --- | --- |
| Login setiap role Supabase | Membutuhkan user Auth dan data `profiles` untuk tiap role | Menunggu konfigurasi |
| RLS antar-role | Membutuhkan project Supabase production | Menunggu konfigurasi |
| Upload bukti pembayaran | Membutuhkan desain verifikasi bukti dan bucket privat terpisah | Menunggu fitur |
| Webhook payment gateway | Membutuhkan endpoint publik dan secret gateway | Menunggu konfigurasi |
| OCR bukti transfer | Membutuhkan service OCR/Edge Function | Menunggu konfigurasi |
| Dua pengguna mengedit bersamaan | Membutuhkan multi-user production | Menunggu konfigurasi |

## Catatan

Tahap ini menguatkan fondasi website/admin yang sudah ada tanpa mengubah tampilan. Fitur CRM penuh dapat dilanjutkan bertahap menggunakan `supabase-schema.sql`.
