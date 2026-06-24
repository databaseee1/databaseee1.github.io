const CACHE_NAME = "Tigoapp.v6"; // 

const urlsToCache = [
  "/New_agency/Login.html",
  "/New_agency/register.html",
  "/New_agency/manifest.json",
  "/New_agency/launchericon-192x192.png",
  "/New_agency/launchericon-512x512.png",
  "/New_agency/offline.html"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );

  // langsung aktif tanpa nunggu lama
  self.skipWaiting();
});

// FETCH (lebih aman + tetap support offline)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // update cache versi baru
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;
      })
      .catch(() => {
        // fallback offline
        return caches.match(event.request).then((res) => {
          return res || caches.match("/New_agency/offline.html");
        });
      })
  );
});

// ACTIVATE (hapus cache lama)
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

  // ambil kontrol langsung
  self.clients.claim();
});


// 🔥 AUTO UPDATE TRIGGER (WAJIB)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});