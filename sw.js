const CACHE_NAME = 'ef-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Instala o Service Worker e salva os arquivos estáticos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Atualiza o cache se houver mudanças (nova versão)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // IMPORTANTE: Ignora o cache para a API do Google Script para não trazer estudo antigo!
  if (url.hostname.includes('script.google.com')) {
    return; // Deixa a requisição seguir normalmente pela rede
  }

  // Para o resto (HTML, ícones), tenta buscar do cache; se não achar, busca da rede
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
