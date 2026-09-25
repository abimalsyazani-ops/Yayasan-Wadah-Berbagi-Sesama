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
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");
const isVerificationFile = (file) => /^google[a-z0-9]+\.html$/i.test(file);
const appPages = fs.readdirSync(root).filter(file => file.endsWith(".html") && file !== "download.html" && !isVerificationFile(file)).map(read);
const publicPages = fs.readdirSync(root).filter(file => file.endsWith(".html") && !["admin.html", "download.html"].includes(file) && !isVerificationFile(file)).map(read);

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
check("Form publik memakai INSERT agar sesuai RLS", store.includes("isPublicInsert?'':'?on_conflict=id'") && store.includes("isPublicInsert?'return=minimal':'resolution=merge-duplicates,return=minimal'"));
check("PWA admin tidak mencache seluruh website", adminSw.includes("wbs-admin-pwa-v17") && adminSw.includes("ADMIN_URLS.has(event.request.url)") && adminSw.includes("cache: 'reload'"));
check("Semua halaman memakai data-store berversi", appPages.every(html => html.includes("assets/data-store.js?v=20260924-2")));
check("Semua halaman publik memakai app.js berversi", publicPages.every(html => html.includes("assets/app.js?v=20260923-3")));
check("Supabase upsert memakai on_conflict=id", store.includes("?on_conflict=id"));
check("Form donasi buku tersinkron ke tabel khusus", app.includes("book_donations") && store.includes("wbs_book_donations_v2"));
check("Dashboard menampilkan dan mengonfirmasi donasi buku", admin.includes("bookDonationAdminList") && admin.includes("confirmSubmission"));
check("Audit log internal tersedia", store.includes("audit_logs") && store.includes("recordAudit"));
check("Tidak ada data dinamis yang ditulis langsung lewat innerHTML", !/\.innerHTML\s*=\s*[^'\"]/.test(admin + app + store));
check("Renderer detail tidak menghapus kerangka halaman saat data kosong", !/root\.innerHTML\s*=/.test(app));
check("Semua renderer detail menangani data kosong", ["renderCampaignDetail", "renderProgramDetail", "renderArticleDetail", "renderGalleryDetail"].every(name => {
  const start = app.indexOf(`function ${name}`);
  const next = app.indexOf("\n  function ", start + 10);
  return start >= 0 && app.slice(start, next >= 0 ? next : undefined).includes("if(!item)");
}));
check("Tidak ada eval/new Function/document.write", !/(eval\s*\(|new Function|document\.write)/.test(admin + app + store));
check("Robots memakai sitemap domain resmi", robots.includes("Sitemap: https://yayasanwadahberbagisesama.com/sitemap.xml"));
check("Sitemap tidak memuat URL lokal", !/localhost|127\.0\.0\.1/.test(sitemap));
check("Sitemap tidak memublikasikan halaman admin atau template detail", !/(admin\.html|(?:article|campaign|gallery|program)-detail\.html)/.test(sitemap));
check("Canonical halaman memakai domain resmi", appPages.every(html => /<link rel="canonical" href="https:\/\/yayasanwadahberbagisesama\.com\//.test(html)));
check("Open Graph halaman memakai URL absolut", appPages.every(html => /<meta property="og:url" content="https:\/\/yayasanwadahberbagisesama\.com\//.test(html)));

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
