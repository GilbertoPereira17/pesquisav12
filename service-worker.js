const cacheName = 'site-static-v12';
const assets = [
    '/',
    '/pesquisav12/index.html',
    '/pesquisav12/style.css',
    '/pesquisav12/script.js',
    '/pesquisav12/manifest.json',
    '/pesquisav12/images/icon-192x192.png',
    '/pesquisav12/images/icon-512x512.png',
    // Adicione outros recursos necessários
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching shell assets');
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        })
    );
});
