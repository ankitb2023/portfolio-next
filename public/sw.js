const CACHE_NAME = "portfolio-cache-v1";
const OFFLINE_URL = "/";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/globe.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        
        // Return custom offline response with HTML
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
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
