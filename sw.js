// Offline support: the app shell is cached on install; fonts are cached as they are first used.
const V = 'kl-1ef8d63acb', SHELL = ['./', 'index.html', 'app.js?v=1ef8d63acb', 'manifest.webmanifest', 'knowledge-lab-icon-192.png', 'knowledge-lab-icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== 'kl-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const r = e.request; if(r.method !== 'GET') return; const u = new URL(r.url);
  if(u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com'){ e.respondWith(caches.open('kl-fonts').then(c => c.match(r).then(hit => hit || fetch(r).then(res => { c.put(r, res.clone()); return res; })))); return; }
  if(u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if(res.ok){ const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); } return res; }).catch(() => caches.match(r).then(hit => hit || (r.mode === 'navigate' ? caches.match('index.html') : Response.error())))); });
