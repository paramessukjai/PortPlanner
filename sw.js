const CACHE_VERSION = 'v1.0.2';
const CACHE_NAME = 'portplanner-' + CACHE_VERSION;

const PRECACHE_URLS = [
  '/PortPlanner/',
  '/PortPlanner/index.html',
  '/PortPlanner/manifest.json',
  '/PortPlanner/icon-192.png',
  '/PortPlanner/icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(PRECACHE_URLS); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (event.request.method === 'GET' && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        if (event.request.mode === 'navigate') {
          return caches.match('/PortPlanner/index.html');
        }
      });
    })
  );
});
