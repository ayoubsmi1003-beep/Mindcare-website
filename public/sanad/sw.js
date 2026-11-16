/* Only this explicit public asset list may enter the cache. No API or patient page is stored. */
const CACHE = 'sanad-public-v3';
const ASSETS = ['/sanad/offline.html','/sanad/offline.js','/sanad/icon.svg','/sanad/icon-192.png','/sanad/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('sanad-public-') && key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET' || url.origin!==self.location.origin) return;
  if(ASSETS.includes(url.pathname) && !url.search) {
    event.respondWith(caches.match(request).then(cached=>cached || fetch(request)));
  } else if(request.mode==='navigate' && (url.pathname==='/sanad' || url.pathname.startsWith('/sanad/'))) {
    event.respondWith(fetch(request).catch(()=>caches.match('/sanad/offline.html').then(cached=>cached || new Response('Offline',{status:503}))));
  }
});
