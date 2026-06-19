/* ============================================================
   Garde-Manger — Service Worker
   Chemins RELATIFS pour compatibilité GitHub Pages sous-répertoire
============================================================ */

const CACHE_NAME = 'garde-manger-v2';

// Chemins relatifs au scope du SW (le dossier où il est installé)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
];

const NETWORK_ONLY_ORIGINS = [
  'generativelanguage.googleapis.com',
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'www.googleapis.com',
  'accounts.google.com',
  'www.gstatic.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ─── Installation ─────────────────────────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // addAll échoue si un seul asset est manquant → on capture les erreurs
      return Promise.allSettled(
        PRECACHE_ASSETS.map(function(url) {
          return cache.add(new Request(url, { cache: 'reload' }));
        })
      );
    })
  );
});

// ─── Activation ───────────────────────────────────────────
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

// ─── Fetch ────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  var url;
  try { url = new URL(event.request.url); } catch(e) { return; }

  // APIs externes → toujours réseau
  if(NETWORK_ONLY_ORIGINS.some(function(o) { return url.hostname === o; })) {
    event.respondWith(fetch(event.request).catch(function() {
      return new Response('', { status: 503 });
    }));
    return;
  }

  if(event.request.method !== 'GET') return;

  // Cache First pour tous les assets statiques
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if(cached) return cached;
      return fetch(event.request).then(function(response) {
        if(!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(event.request, clone); });
        return response;
      }).catch(function() {
        // Fallback offline : retourner index.html pour toute navigation
        if(event.request.mode === 'navigate') {
          return caches.match('./index.html').then(function(r) {
            return r || caches.match('./');
          });
        }
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
