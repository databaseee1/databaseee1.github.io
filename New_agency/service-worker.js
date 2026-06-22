const CACHE_NAME = "Tigoapp.v4";

// semua pakai root /New_agency/
const BASE_PATH = "/New_agency/";

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + "Login.html",
  BASE_PATH + "register.html",
  BASE_PATH + "style.css",
  BASE_PATH + "app.js",
  BASE_PATH + "launchericon-192x192.png",
  BASE_PATH + "launchericon-512x512.png",
  BASE_PATH + "offline.html"
];

// INSTALL
self.addEventListener("install", (event) => {
  console.log("SW installing...");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// FETCH (cache first + update)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
  console.log("SW activated");
});