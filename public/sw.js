const CACHE = "kodomo-zukan-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 外部メディア（Wikimedia画像 / Freesound音声 / YouTube）はSWを通さない
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          const fallback = await cache.match(self.registration.scope);
          if (fallback) return fallback;
        }
        return Response.error();
      }
    })()
  );
});
