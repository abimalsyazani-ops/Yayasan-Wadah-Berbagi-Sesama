const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('assets/data-store.js', 'utf8');
let browserWrites = 0;
let browserRemovals = 0;
let failNextSave = false;

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
    if (options.method === 'POST' && failNextSave) {
      failNextSave = false;
      return { ok: false, status: 500, json: async () => ({}) };
    }
    return { ok: true, status: 200, json: async () => [] };
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

  console.log(JSON.stringify({ passed: true, browserWrites, browserRemovals, checks: 5 }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
