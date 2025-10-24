const CACHE_NAME = 'buraco-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            // Return offline page or cached content if available
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Background sync for saving game data
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'save-game-data') {
    event.waitUntil(
      // Handle background sync for saving player style data
      saveGameDataOffline()
    );
  }
});

// Handle saving game data when offline
async function saveGameDataOffline() {
  try {
    // This will be handled by the main game script
    // The service worker just ensures the sync happens
    console.log('Service Worker: Background save triggered');
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Background save failed', error);
    return Promise.reject(error);
  }
}

// Handle push notifications (for future updates)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New game update available!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Game',
        icon: './icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Buraco Game', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});