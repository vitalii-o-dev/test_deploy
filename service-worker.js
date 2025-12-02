const CACHE_NAME = 'simple-pwa-notes-v1';
// List the essential files needed for offline functionality
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json'
];

// Install Event: Caches all required assets
self.addEventListener('install', (event) => {
    console.log('SW: Installing and caching assets.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Add all files listed above to the cache
                return cache.addAll(urlsToCache);
            })
    );
    // Forces the new service worker to activate immediately, skipping the waiting phase.
    self.skipWaiting(); 
});

// Fetch Event: Intercepts network requests and serves content from the cache first (Cache-First strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the request is in the cache, return the cached response
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request);
            })
    );
});

// Activate Event: Cleans up old caches to save storage space
self.addEventListener('activate', (event) => {
    console.log('SW: Activating and cleaning up old caches.');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete any cache that is not in the whitelist (i.e., old versions)
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Claim control of clients immediately
    return self.clients.claim();
});