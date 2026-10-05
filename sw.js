/* AbrxsVAV Status — Service Worker: shell offline + red primero para contenido dinámico */
const CACHE = 'abrxsvav-v1';
const SHELL = ['index.html', 'tools.html', 'workflows.html', 'support.html', 'status.html',
  'assets/style.css', 'assets/app.js', 'assets/knowledge.js', 'assets/icon.svg', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Status en vivo + API de GitHub: red primero, sin cachear (rate limits y frescura)
  if (url.hostname.includes('githubusercontent.com') || url.hostname === 'api.github.com') return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('index.html'))
    )
  );
});
