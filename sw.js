/* ============================================================
   CiweiPet Service Worker · v9
   缓存：图标 + 7 张刺猬图片 + 页面
================================================================ */
var CACHE_NAME = 'ciweipet-v9';
var STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './idle-1.png',
    './idle-2.png',
    './blink.png',
    './surprised.png',
    './happy.png',
    './angry.png',
    './sleep.png',
    './ciweipet.js',
    './ciweipet.css'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) { return cache.addAll(STATIC_ASSETS); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    var url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then(function (cached) {
            var network = fetch(e.request).then(function (res) {
                if (res && res.status === 200) {
                    var clone = res.clone();
                    caches.open(CACHE_NAME).then(function (c) {
                        c.put(e.request, clone);
                    });
                }
                return res;
            }).catch(function () { return cached; });
            return cached || network;
        })
    );
});