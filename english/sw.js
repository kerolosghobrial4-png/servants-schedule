/* Offline cache for Sekka English. Bump VERSION when files change. */
const VERSION = 'sekka-v9';
const FILES = ['./', 'index.html', 'styles.css?v=9', 'app.js?v=9', 'speech.js?v=9', 'manifest.webmanifest',
  'content/level1.js?v=9', 'content/level2.js?v=9', 'content/level3.js?v=9', 'content/level4.js?v=9',
  'content/level5.js?v=9', 'content/level6.js?v=9', 'content/talk.js?v=9', 'content/dialogues2.js?v=9', 'content/extra.js?v=9', 'content/extra2.js?v=9', 'content/extra3.js?v=9', 'content/words2.js?v=9', 'content/college.js?v=9', 'content/words3.js?v=9', 'content/extra4.js?v=9', 'content/stories.js?v=9', 'content/stories2.js?v=9', 'content/stories3.js?v=9', 'content/stories4.js?v=9', 'content/stories5.js?v=9', 'content/jobs.js?v=9', 'content/placement.js?v=9', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
