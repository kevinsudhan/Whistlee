// This is a simple service worker for the Whistle Finance PWA

const CACHE_NAME = 'whistle-finance-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/app-icon.svg',
  '/images/whistle-logo.svg',
  '/images/token-icon.svg',
  '/animations/Animation - 1746433301187.json',
  '/animations/Animation - 1746434935079.json',
  '/animations/Animation - 1746436161234.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
