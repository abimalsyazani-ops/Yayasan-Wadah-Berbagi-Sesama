# Persiapan Migrasi Supabase

Website menggunakan pola repository pada `assets/data-store.js`. Saat ini `WBS.repository` memakai `LocalRepository`. Untuk produksi, buat Supabase client lalu ganti dengan `new WBS.SupabaseRepository(client)`.

## Tabel

- `articles`: `id`, `title`, `category`, `date`, `excerpt`, `content`, `image`, `created_at`
- `campaigns`: `id`, `title`, `category`, `description`, `collected`, `target`, `deadline`, `image`, `created_at`
- `documents`: `id`, `title`, `category`, `period`, `file_name`, `file_url`, `created_at`
- `gallery`: `id`, `title`, `category`, `date`, `image`, `created_at`
- `volunteers`: `id`, `name`, `phone`, `email`, `role`, `motivation`, `status`, `created_at`
- `donors`: `id`, `salutation`, `name`, `public_name`, `anonymous`, `phone`, `email`, `city`, `prayer`, `campaign`, `amount`, `payment_method`, `status`, `created_at`
- `messages`: `id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`

Gunakan Supabase Storage untuk gambar dan PDF. Simpan URL file pada tabel, bukan data Base64. Terapkan Supabase Auth dan Row Level Security sebelum website dipublikasikan.
