/* ============================================================
   Garde-Manger — Service Worker
   Stratégie : Cache First pour les assets statiques,
   Network First pour les API externes (Gemini, Google).
============================================================ */

const CACHE_NAME = 'garde-manger-v1';

// Assets à mettre en cache immédiatement à l'installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  // Polices Google (mises en cache au premier accès)
];

// Domaines qui ne doivent JAMAIS passer par le cache
const NETWORK_ONLY_ORIGINS = [
  'generativelanguage.googleapis.com',  // API Gemini
  'firestore.googleapis.com',             // Firestore
  'firebase.googleapis.com',              // Firebase
  'www.googleapis.com',                  // Google Drive
  'accounts.google.com',                 // Google Auth
  'gmailmcp.googleapis.com'
];

// ─── Installation ────────────────────────────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// ─── Activation : purge des anciens caches ──────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ─── Interception des requêtes ───────────────────────────────
self.addEventListener('fetch', function(event) {
  var url;
  try { url = new URL(event.request.url); } catch(e) { return; }

  // API externes → toujours réseau (pas de cache)
  var isNetworkOnly = NETWORK_ONLY_ORIGINS.some(function(origin) {
    return url.hostname === origin || url.hostname.endsWith('.' + origin);
  });
  if (isNetworkOnly) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Polices Google → Stale While Revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          var networkFetch = fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(function() { return cached; });
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // Assets statiques → Cache First, réseau en fallback
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        // Offline fallback : retourne index.html pour les navigations
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ─── Message de mise à jour ──────────────────────────────────
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
