const CACHE_NAME = "portfolio-cache-v2";
const OFFLINE_URL = "/";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/abtransparentIcon.png",
  "/abIcon.png",
  "/images/profileupdated.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache essential resources
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  // Next.js specific hot-reloading bypass
  if (event.request.url.includes('/_next/webpack-hmr') || event.request.url.includes('/_next/development')) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // Try the network first
        const networkResponse = await fetch(event.request);
        
        // Save the valid network response in cache dynamically
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Network failed (offline), try the cache
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's a page navigation and not in cache, show custom offline html fallback
        if (event.request.mode === "navigate") {
          return new Response(
            `<!DOCTYPE html>
             <html lang="en">
             <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               <title>Offline | Ankit Portfolio</title>
               <style>
                 body { background: #05020a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                 h1 { font-size: 2rem; margin-bottom: 1rem; color: #8b5cf6; }
                 p { font-size: 1.2rem; color: #a3a3a3; }
               </style>
             </head>
             <body>
               <h1>You're offline but still exploring my portfolio 😎</h1>
               <p>Please check your internet connection to view the full experience.</p>
             </body>
             </html>`,
            {
              headers: { "Content-Type": "text/html" }
            }
          );
        }
      }
    })()
  );
});
