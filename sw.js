// PortPlanner Service Worker
// เปลี่ยน CACHE_VERSION ทุกครั้งที่ deploy ใหม่
const CACHE_VERSION = 'v1.0.6';
const CACHE_NAME    = 'portplanner-' + CACHE_VERSION;

const PRECACHE_URLS = [
  '/PortPlanner/',
  '/PortPlanner/index.html',
  '/PortPlanner/manifest.json',
  '/PortPlanner/icon-192.png',
  '/PortPlanner/icon-512.png'
];

// ── INSTALL ──────────────────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting(); // เข้าแทนที่ทันที ไม่รอ tab เก่า
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// ── ACTIVATE ─────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim(); // บังคับทุก tab ใช้ SW ใหม่ทันที
    })
  );
});

// ── FETCH ─────────────────────────────────────
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Firebase / CDN → ไม่ cache
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  // HTML → Network-First (ได้โค้ดใหม่เสมอถ้ามีเน็ต)
  if (event.request.mode === 'navigate' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        return response;
      }).catch(function() {
        return caches.match('/PortPlanner/index.html');
      })
    );
    return;
  }

  // Assets → Cache-First
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (event.request.method === 'GET' && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        }
        return response;
      });
    })
  );
});
