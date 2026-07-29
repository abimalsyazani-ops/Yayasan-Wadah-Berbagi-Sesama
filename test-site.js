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
const schema = read("supabase-schema.sql");

check("Admin session tidak memakai string active", !/sessionStorage\.(?:setItem|getItem)\(sessionKey,\s*['"]active['"]/.test(admin));
check("Production login memakai Supabase password auth", admin.includes("signInWithPassword"));
check("Production session memakai getSession", admin.includes("auth.getSession"));
check("Logout memakai Supabase signOut", admin.includes("auth.signOut"));
check("Tidak ada password demo hardcoded", !/password\s*[:=]\s*['"][^'"]{4,}['"]/i.test(admin + store));
check("Validasi MIME upload admin tersedia", admin.includes("imageTypes") && admin.includes("documentTypes"));
check("Proteksi submit ganda admin tersedia", admin.includes("dataset.busy") && admin.includes("Menyimpan..."));
check("Ekspor donatur aman formula injection", admin.includes("safeCsvCell") && admin.includes("/^[=+\\-@]/"));
check("Campaign menghitung donasi tersimpan", app.includes("campaignStats") && app.includes("repo.list('donors')"));
check("Donasi publik divalidasi", app.includes("validateDonation") && app.includes("Nominal donasi minimal"));
check("Mode demo/production tersedia", store.includes("const APP_MODE='demo'") && store.includes("APP_MODE==='production'"));
check("Supabase upsert memakai on_conflict=id", store.includes("?on_conflict=id"));
check("Audit log internal tersedia", store.includes("audit_logs") && store.includes("recordAudit"));
check("Tidak ada innerHTML di aset JS", !/\.innerHTML\s*=/.test(admin + app + store));
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
