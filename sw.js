/* «Дзвін»: офлайн-кеш. Версія кешу = хеш файлів, тож після нового викладення застосунок оновиться сам. */
const CACHE = 'dzvin-75cc9d238c';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/favicon-32.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'assets/t_p_atlas_lit.webp', 'assets/t_p_atlas_night.webp', 'assets/t_p_glow.webp', 'assets/t_p_lit.webp', 'assets/t_p_litglow.webp', 'assets/t_p_night.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate'){
    e.respondWith(fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); } return res; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
});
