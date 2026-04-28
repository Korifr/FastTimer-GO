const staticCacheName = 'fasttimer-static-v1';
 const assets = [
    "/FastTimer-GO/",
    "/FastTimer-GO/index.html",
    "/FastTimer-GO/cooldown.html",
    "/FastTimer-GO/assets/script.js",
    "/FastTimer-GO/assets/cooldown.js",
    "/FastTimer-GO/assets/style.css",
    "/FastTimer-GO/assets/cooldown.css",
    "/FastTimer-GO/assets/icons/icon-72x72.png",
    "/FastTimer-GO/assets/icons/icon-96x96.png",
    "/FastTimer-GO/assets/icon-192.png",
    "/FastTimer-GO/assets/icon-512.png",
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