const CACHE_NAME = 'wildlife-guardians-v1';
const STATIC_CACHE = 'wildlife-static-v1';
const DYNAMIC_CACHE = 'wildlife-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.tsx',
  '/src/App.tsx',
  '/manifest.json',
  '/favicon.svg',
  '/wildlife-icon.svg'
];

const API_BASE_URL = 'https://wildlife-guardians-backends.vercel.app/api';

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.log('Failed to cache static assets:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests with cache-first strategy for static, network-first for API
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests - Network first, cache as fallback
  if (url.href.startsWith(API_BASE_URL)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for critical API endpoints
              if (url.pathname.includes('/animals')) {
                return new Response(JSON.stringify({
                  success: true,
                  data: [
                    {
                      id: 1,
                      name: "African Elephant",
                      status: "Endangered",
                      description: "Large mammals found in Africa",
                      habitat: "Savanna",
                      population: "415000",
                      threats: "Poaching, habitat loss"
                    }
                  ],
                  offline: true
                }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              return new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
    return;
  }

  // Handle static assets - Cache first
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          return cachedResponse || fetch(request)
            .then(response => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone));
              return response;
            });
        })
    );
    return;
  }

  // Handle other requests - Network first
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then(cachedResponse => {
            return cachedResponse || caches.match('/index.html');
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
  
  if (event.tag === 'sync-user-progress') {
    event.waitUntil(syncUserProgress());
  }
});

// Handle offline quiz results sync
async function syncQuizResults() {
  try {
    const db = await openDB();
    const tx = db.transaction(['pending_quiz_results'], 'readonly');
    const store = tx.objectStore('pending_quiz_results');
    const pendingResults = await store.getAll();
    
    for (const result of pendingResults) {
      try {
        const response = await fetch(`${API_BASE_URL}/quiz-results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${result.token}`
          },
          body: JSON.stringify(result.data)
        });
        
        if (response.ok) {
          // Remove from pending after successful sync
          const deleteTx = db.transaction(['pending_quiz_results'], 'readwrite');
          const deleteStore = deleteTx.objectStore('pending_quiz_results');
          await deleteStore.delete(result.id);
        }
      } catch (error) {
        console.log('Failed to sync quiz result:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Handle offline user progress sync
async function syncUserProgress() {
  try {
    const db = await openDB();
    const tx = db.transaction(['pending_progress'], 'readonly');
    const store = tx.objectStore('pending_progress');
    const pendingProgress = await store.getAll();
    
    for (const progress of pendingProgress) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${progress.token}`
          },
          body: JSON.stringify(progress.data)
        });
        
        if (response.ok) {
          const deleteTx = db.transaction(['pending_progress'], 'readwrite');
          const deleteStore = deleteTx.objectStore('pending_progress');
          await deleteStore.delete(progress.id);
        }
      } catch (error) {
        console.log('Failed to sync progress:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WildlifeGuardiansDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pending_quiz_results')) {
        db.createObjectStore('pending_quiz_results', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pending_progress')) {
        db.createObjectStore('pending_progress', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('cached_animals')) {
        db.createObjectStore('cached_animals', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('cached_quizzes')) {
        db.createObjectStore('cached_quizzes', { keyPath: 'id' });
      }
    };
  });
}

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New wildlife content available!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'View',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Wildlife Guardians', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});
