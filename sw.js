// PortPlanner Service Worker
// อัพเดท CACHE_VERSION ทุกครั้งที่ deploy โค้ดใหม่ เพื่อให้ cache รีเฟรช
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME    = `portplanner-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/PortPlanner/',
  '/PortPlanner/index.html',
  '/PortPlanner/manifest.json',
  '/PortPlanner/icon-192.png',
  '/PortPlanner/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
];

// ── INSTALL: precache static assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete old caches ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for static, network-first for Firebase ─
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firebase & analytics → always network (no cache)
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('google-analytics')) {
    return; // let browser handle normally
  }

  // Everything else → Cache First, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid GET responses
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/PortPlanner/index.html');
        }
      });
    })
  );
});
