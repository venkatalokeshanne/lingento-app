// This service worker can be customized
const BUILD_TIMESTAMP = new Date().toISOString();
const CACHE_VERSION = `${new Date().getFullYear()}.${(new Date().getMonth() + 1).toString().padStart(2, '0')}.${new Date().getDate().toString().padStart(2, '0')}-${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}.${new Date().getSeconds().toString().padStart(2, '0')}`;
const CACHE_NAME = `lingento-app-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `lingento-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `lingento-dynamic-v${CACHE_VERSION}`;

console.log(`Service Worker built at: ${BUILD_TIMESTAMP}`);
console.log(`Cache version: ${CACHE_VERSION}`);

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log(`Service Worker installing... Version: ${CACHE_VERSION} at ${BUILD_TIMESTAMP}`);
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets with version:', CACHE_VERSION);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Static assets cached, forcing skipWaiting');
        // Force the new service worker to take control immediately
        return self.skipWaiting();
      })
  );
});

// Fetch event - implement network-first strategy for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle different types of requests
  if (request.mode === 'navigate') {
    // For navigation requests (HTML pages), use network-first strategy
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If network fails, serve from cache
          return caches.match('/') || caches.match(request);
        })
    );
  } else if (request.destination === 'document') {
    // For document requests, prefer network
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // For static assets, use cache-first strategy
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          // If not in cache, fetch from network and cache it
          return fetch(request).then(fetchResponse => {
            // Check if we received a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            const responseToCache = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });

            return fetchResponse;
          });
        })
    );
  }
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log(`Service Worker activating... Version: ${CACHE_VERSION} at ${BUILD_TIMESTAMP}`);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Found caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              (cacheName.startsWith('lingento-') || cacheName.startsWith('workbox-'))) {
            console.log(`Deleting old cache: ${cacheName} (current version: ${CACHE_VERSION})`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`Service Worker v${CACHE_VERSION} taking control of all clients`);
      // Take control of all clients immediately
      return self.clients.claim();
    }).then(() => {
      // Notify all clients that the service worker has been updated
      return self.clients.matchAll().then(clients => {
        console.log(`Notifying ${clients.length} clients about SW activation`);
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION,
            buildTime: BUILD_TIMESTAMP,
            meta: `Service Worker updated to version ${CACHE_VERSION}`
          });
        });
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`Received SKIP_WAITING message for version ${CACHE_VERSION}`);
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    // Send back the current cache version
    event.ports[0].postMessage({
      type: 'VERSION_RESPONSE',
      version: CACHE_VERSION,
      buildTime: BUILD_TIMESTAMP,
      timestamp: new Date().toISOString()
    });
  }
});

// Notify clients when a new version is available
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    console.log(`Manual update check requested for version ${CACHE_VERSION}`);
    // Force update check
    self.registration.update().then(() => {
      console.log('Update check completed');
    });
  }
});
