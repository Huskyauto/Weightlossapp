// Service Worker - disabled to prevent caching issues
// This SW immediately clears all caches and unregisters itself

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first: always go to network, never serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
