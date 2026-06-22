const CACHE_NAME = "Tigoapp.v3";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./192x192.png",
  "./512x512.png",
  "./offline.html"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch dengan fallback ke offline.html
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((res) => res || caches.match("./offline.html"))
      )
  );
});

// Hapus cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  console.log("✅ Service Worker: Activated");
  self.clients.claim();
});
