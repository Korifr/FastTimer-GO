const staticCacheName = 'fasttimer-static-v1';
 const assets = [
    "/",
    "/index.html",
    "/cooldown.html",
    "/assets/script.js",
    "/assets/cooldown.js",
    "/assets/style.css",
    "/assets/cooldown.css",
    "/assets/icons/icon-72x72.png",
    "/assets/icons/icon-96x96.png",
    "/assets/icon-192.png",
    "/assets/icon-512.png",
];

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});