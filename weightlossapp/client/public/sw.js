// Service Worker v2 - Force cache bust and network-first
// Changing the version name forces the browser to treat this as a NEW service worker
const CACHE_VERSION = 'wlc-v2-bust';

// Install: skip waiting immediately so this SW takes over right away
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: delete ALL old caches and claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete every single cache, including the old wlc-v1
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Take control of all open tabs/windows immediately
      return self.clients.claim();
    }).then(() => {
      // Force all controlled clients to reload with the new version
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.navigate(client.url);
        });
      });
    })
  );
});

// Fetch: ALWAYS go to network, never serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Only fall back to cache if network fails (offline)
      return caches.match(event.request);
    })
  );
});
