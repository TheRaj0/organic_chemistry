self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("chem-cache-v1").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/index.js",
        "/manifest.json",
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
