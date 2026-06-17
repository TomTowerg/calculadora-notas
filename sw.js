/* Service Worker — Gradiant PWA
   Estrategia: cache-first para la app, network-only para Firebase.
   Al actualizar la versión, cambiar CACHE_NAME para forzar recarga. */

const CACHE_NAME = 'gradiant-v15';
const APP_FILES = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
];

/* URLs de Firebase que nunca se cachean */
const FIREBASE_HOSTS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'www.googleapis.com',
  'firebaseapp.com',
  'gstatic.com',
];

function isFirebase(url) {
  return FIREBASE_HOSTS.some(h => url.includes(h));
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  /* Firebase: siempre red, nunca caché */
  if (isFirebase(e.request.url)) return;

  /* App: cache-first, fallback a red */
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
