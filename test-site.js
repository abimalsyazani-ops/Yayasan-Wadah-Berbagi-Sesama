const fs = require("fs");
const path = require("path");

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];

function check(name, pass, note = "") {
  checks.push({ name, status: pass ? "PASS" : "FAIL", note });
}

const admin = read("assets/admin.js");
const app = read("assets/app.js");
const store = read("assets/data-store.js");
const adminSw = read("admin-sw.js");
const schema = read("supabase-schema.sql");
const mediaStorage = read("supabase/media_storage_update.sql");

check("Admin session tidak memakai string active", !/sessionStorage\.(?:setItem|getItem)\(sessionKey,\s*['"]active['"]/.test(admin));
check("Production login memakai Supabase password auth", admin.includes("signInWithPassword"));
check("Production session memakai getSession", admin.includes("auth.getSession"));
check("OAuth callback dipantau melalui onAuthStateChange", admin.includes("auth.onAuthStateChange") && admin.includes("INITIAL_SESSION") && admin.includes("SIGNED_IN"));
check("Supabase client mendeteksi sesi dari URL", admin.includes("detectSessionInUrl:true") && admin.includes("persistSession:true"));
check("Login Google memeriksa error OAuth", admin.includes("signInWithOAuth") && admin.includes("if(error)throw error"));
check("Login password mengarahkan akun Google ke metode yang benar", admin.includes("gunakan tombol Masuk dengan Google"));
check("Upload media admin memakai Supabase Storage", admin.includes("storage.from(storageBucket).upload") && admin.includes("getPublicUrl"));
check("Penyimpanan admin menunggu sinkronisasi server", admin.includes("async function saveWithUploads") && admin.includes("await repo.saveAndSync(type,item)"));
check("Foto sementara dibersihkan bila penyimpanan gagal", admin.includes("removeUploadedImages(uploaded)") && admin.includes("storage.from(storageBucket).remove(paths)"));
check("Mode produksi memakai cache memori", store.includes("runtimeRows") && store.includes("APP_MODE==='production'?(runtimeRows[type]||[])"));
check("Cache browser lama dibersihkan setelah sinkronisasi", store.includes("localStorage.removeItem(keys[type])") && store.includes("localStorage.removeItem(keys.audit_logs)"));
check("Migrasi bucket media tersedia", mediaStorage.includes("website-media") && mediaStorage.includes("Authenticated upload website media"));
check("Migrasi media memberi akses baca admin", mediaStorage.includes("Authenticated read website media"));
check("Logout memakai Supabase signOut", admin.includes("auth.signOut"));
check("Tidak ada password demo hardcoded", !/password\s*[:=]\s*['"][^'"]{4,}['"]/i.test(admin + store));
check("Validasi MIME upload admin tersedia", admin.includes("imageTypes") && admin.includes("documentTypes"));
check("Proteksi submit ganda admin tersedia", admin.includes("dataset.busy") && admin.includes("Menyimpan..."));
check("Ekspor donatur aman formula injection", admin.includes("safeCsvCell") && admin.includes("/^[=+\\-@]/"));
check("Campaign menghitung donasi tersimpan", app.includes("campaignStats") && app.includes("repo.list('donors')"));
check("Donasi publik divalidasi", app.includes("validateDonation") && app.includes("Nominal donasi minimal"));
check("Mode produksi Supabase aktif", store.includes("const APP_MODE='production'") && store.includes("APP_MODE==='production'"));
check("Publishable key tidak dikirim sebagai Bearer JWT", store.includes("if(this.accessToken)headers.Authorization='Bearer '+this.accessToken") && !store.includes("this.accessToken||this.key"));
check("PWA admin tidak mencache seluruh website", adminSw.includes("wbs-admin-pwa-v14") && adminSw.includes("ADMIN_URLS.has(event.request.url)") && adminSw.includes("cache: 'reload'"));
check("Supabase upsert memakai on_conflict=id", store.includes("?on_conflict=id"));
check("Form donasi buku tersinkron ke tabel khusus", app.includes("book_donations") && store.includes("wbs_book_donations_v2"));
check("Dashboard menampilkan dan mengonfirmasi donasi buku", admin.includes("bookDonationAdminList") && admin.includes("confirmSubmission"));
check("Audit log internal tersedia", store.includes("audit_logs") && store.includes("recordAudit"));
check("Tidak ada data dinamis yang ditulis langsung lewat innerHTML", !/\.innerHTML\s*=\s*[^'\"]/.test(admin + app + store));
check("Tidak ada eval/new Function/document.write", !/(eval\s*\(|new Function|document\.write)/.test(admin + app + store));

[
  "profiles",
  "roles",
  "cs_applications",
  "cs_profiles",
  "donors",
  "donor_followups",
  "campaigns",
  "donations",
  "donation_proofs",
  "donation_allocations",
  "commission_records",
  "commission_payouts",
  "leaderboard_periods",
  "leaderboard_rewards",
  "expenses",
  "accounts",
  "fund_buckets",
  "fund_movements",
  "audit_logs",
  "system_settings",
  "reports",
].forEach((table) => check(`Schema memuat tabel ${table}`, new RegExp(`create table if not exists public\\.${table}\\b`, "i").test(schema)));

const failed = checks.filter((item) => item.status === "FAIL");
console.log(JSON.stringify({ total: checks.length, passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
if (failed.length) process.exit(1);
