const CACHE_NAME = "Tigoapp.v9";

const urlsToCache = [
  "/",
  "/Login.html",
  "/register.html",
  "/manifest.json",
  "/launchericon-192x192.png",
  "/launchericon-512x512.png",
  "/offline.html"
];


// ================= INSTALL =================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});


// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});


// ================= FETCH =================
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((res) => {
          return res || caches.match("/New_agency/offline.html");
        });
      })
  );
});


// ================= AUTO UPDATE =================
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});