// Service Worker for Wildlife Guardians
const CACHE_NAME = 'wildlife-guardians-v1';
const OFFLINE_URL = '/offline.html';
// Assets to cache immediately when the service worker is installed
const PRECACHE_ASSETS = ['/', '/index.html', '/offline.html', '/static/js/main.chunk.js', '/static/js/bundle.js', '/static/css/main.chunk.css', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80'];
// Install event - precache assets
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    console.log('Service worker pre-caching offline assets');
    return cache.addAll(PRECACHE_ASSETS);
  }).then(() => {
    return self.skipWaiting();
  }));
});
// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => {
      if (cacheName !== CACHE_NAME) {
        console.log('Service worker removing old cache:', cacheName);
        return caches.delete(cacheName);
      }
    }));
  }).then(() => {
    return self.clients.claim();
  }));
});
// Helper function to determine if a request is for an API call
const isApiRequest = request => {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
};
// Helper function to determine if a request is for an image
const isImageRequest = request => {
  return request.destination === 'image';
};
// Helper function to determine if a request is for a static asset
const isStaticAssetRequest = request => {
  const url = new URL(request.url);
  return url.pathname.startsWith('/static/') || url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
};
// Fetch event - handle requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(caches.match(event.request).then(cachedResponse => {
    // Return cached response if available
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(event.request).then(response => {
      // Don't cache responses that aren't successful
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      // Cache static assets and images for future use
      if (isStaticAssetRequest(event.request) || isImageRequest(event.request)) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(error => {
      // If the request is for a page (navigation), show the offline page
      if (event.request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      // For API requests, return a custom offline response
      if (isApiRequest(event.request)) {
        return new Response(JSON.stringify({
          error: 'You are offline',
          offline: true
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      // For image requests that fail, you could return a placeholder
      if (isImageRequest(event.request)) {
        return caches.match('/assets/placeholder.png');
      }
    });
  }));
});
// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'quiz-submission') {
    event.waitUntil(syncQuizSubmissions());
  } else if (event.tag === 'user-activity') {
    event.waitUntil(syncUserActivity());
  }
});
// Function to sync quiz submissions when back online
async function syncQuizSubmissions() {
  try {
    const db = await openIndexedDB();
    const offlineSubmissions = await db.getAll('offlineQuizResults');
    for (const submission of offlineSubmissions) {
      try {
        // Attempt to send to server
        const response = await fetch('/api/quiz-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission)
        });
        if (response.ok) {
          // If successful, remove from IndexedDB
          await db.delete('offlineQuizResults', submission.id);
        }
      } catch (error) {
        console.error('Failed to sync quiz submission:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncQuizSubmissions:', error);
  }
}
// Function to sync user activity when back online
async function syncUserActivity() {
  try {
    const db = await openIndexedDB();
    const offlineActivities = await db.getAll('offlineActivities');
    for (const activity of offlineActivities) {
      try {
        // Attempt to send to server
        const response = await fetch('/api/user-activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(activity)
        });
        if (response.ok) {
          // If successful, remove from IndexedDB
          await db.delete('offlineActivities', activity.id);
        }
      } catch (error) {
        console.error('Failed to sync user activity:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncUserActivity:', error);
  }
}
// Helper function to open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wildlifeGuardiansDB', 1);
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
    request.onsuccess = event => {
      const db = event.target.result;
      resolve({
        getAll: storeName => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        },
        delete: (storeName, id) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      });
    };
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineQuizResults')) {
        db.createObjectStore('offlineQuizResults', {
          keyPath: 'id'
        });
      }
      if (!db.objectStoreNames.contains('offlineActivities')) {
        db.createObjectStore('offlineActivities', {
          keyPath: 'id'
        });
      }
    };
  });
}