const CACHE_NAME = 'wbs-admin-pwa-v5';
const ADMIN_ASSETS = [
  './admin.html',
  './admin.webmanifest',
  './assets/styles.css',
  './assets/data-store.js',
  './assets/app.js',
  './assets/admin.js',
  './assets/wbs-logo.png'
];

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
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
