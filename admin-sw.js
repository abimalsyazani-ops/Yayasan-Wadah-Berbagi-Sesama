const CACHE_NAME = 'wbs-admin-pwa-v15';
const ADMIN_ASSETS = [
  './admin.html',
  './admin.webmanifest',
  './assets/styles.css',
  './assets/data-store.js?v=20260923-2',
  './assets/app.js?v=20260923-3',
  './assets/admin.js',
  './assets/wbs-logo.png',
  './assets/wbs-admin-icon-192.png',
  './assets/wbs-admin-icon-512.png'
];
const ADMIN_URLS = new Set(ADMIN_ASSETS.map(path => new URL(path, self.location.href).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ADMIN_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const cacheable = ADMIN_URLS.has(event.request.url);
  const networkRequest = new Request(event.request, { cache: 'reload' });
  event.respondWith(
    fetch(networkRequest)
      .then(response => {
        if (cacheable && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => cacheable ? caches.match(event.request) : Response.error())
  );
});
