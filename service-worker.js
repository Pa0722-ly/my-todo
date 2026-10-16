const CACHE_NAME = 'daily-check-cache-v1';
const FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js'
  // 若有 icon-192.png / icon-512.png 请加到这里
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 简单离线策略：先尝试网络，失败则缓存
  e.respondWith(
    fetch(e.request).catch(()=> caches.match(e.request)).catch(()=> caches.match('/'))
  );
});
