const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('assets/data-store.js', 'utf8');
let browserWrites = 0;
let browserRemovals = 0;
let failNextSave = false;
let lastRequestHeaders = null;
let anonymousSaveAttempt = 0;
const anonymousHeaders = [];

const context = {
  console,
  navigator: { userAgent: 'WBS automated test' },
  CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
  localStorage: {
    getItem() { return null; },
    setItem() { browserWrites += 1; throw new Error('QuotaExceededError'); },
    removeItem() { browserRemovals += 1; }
  },
  fetch: async (url, options = {}) => {
    lastRequestHeaders = options.headers || null;
    if (options.method === 'POST' && options.body?.includes('MSG-anon-header-test')) {
      anonymousSaveAttempt += 1;
      anonymousHeaders.push(options.headers || null);
      if (anonymousSaveAttempt === 1) return { ok: false, status: 401, text: async () => 'Invalid API key' };
    }
    if (options.method === 'POST' && failNextSave) {
      failNextSave = false;
      return { ok: false, status: 500, text: async () => 'Simulated server failure' };
    }
    return { ok: true, status: 200, json: async () => [], text: async () => '' };
  },
  setTimeout,
  clearTimeout
};
context.window = context;
context.window.dispatchEvent = () => {};

vm.createContext(context);
vm.runInContext(source, context);

(async () => {
  const { WBS } = context;
  await WBS.supabaseSync.upsert('messages', { id: 'MSG-anon-header-test', message: 'Uji header anonim' });
  if (!anonymousHeaders[0]?.apikey || anonymousHeaders[0].Authorization) {
    throw new Error('Percobaan pertama anonim harus memakai apikey tanpa Authorization Bearer.');
  }
  if (anonymousSaveAttempt !== 2 || anonymousHeaders[1]?.Authorization !== `Bearer ${WBS.supabaseConfig.key}`) {
    throw new Error('Permintaan anonim 401 harus dicoba ulang dengan fallback publishable Bearer.');
  }
  WBS.supabaseSync.setAccessToken('test-access-token');
  await WBS.hydrateFromSupabase();

  const article = {
    id: 'ART-storage-test',
    title: 'Uji penyimpanan produksi',
    category: 'Kegiatan Yayasan',
    date: '2026-09-23',
    excerpt: 'Uji',
    content: 'Uji',
    image: 'https://example.com/article.webp'
  };

  await WBS.repository.saveAndSync('articles', article);
  if (WBS.repository.find('articles', article.id)?.title !== article.title) {
    throw new Error('Artikel tidak tersedia pada cache memori produksi.');
  }
  if (browserWrites !== 0) throw new Error('Mode produksi masih menulis ke localStorage.');

  failNextSave = true;
  try {
    await WBS.repository.saveAndSync('articles', { ...article, title: 'Perubahan gagal' });
    throw new Error('Simulasi kegagalan server seharusnya ditolak.');
  } catch (error) {
    if (!String(error.message).includes('Data belum tersimpan ke server')) throw error;
  }
  if (WBS.repository.find('articles', article.id)?.title !== article.title) {
    throw new Error('Rollback tidak memulihkan artikel sebelumnya.');
  }
  if (browserWrites !== 0) throw new Error('Rollback produksi masih menulis ke localStorage.');

  if (browserRemovals < 1) throw new Error('Cache browser lama tidak dibersihkan setelah sinkronisasi.');

  console.log(JSON.stringify({ passed: true, browserWrites, browserRemovals, anonymousSaveAttempt, checks: 7 }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
