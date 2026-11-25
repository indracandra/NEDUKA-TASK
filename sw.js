const CACHE_NAME = 'neduka-task-static-v1.7.12';
const APP_FILES = ['./', './index.html', './style.css', './app.js', './manifest.json', './assets/icon.svg', './assets/logo-sekolah.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('neduka-task-static-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request=event.request, url=new URL(request.url);
  if(url.origin!==self.location.origin || request.method!=='GET') return;
  const isAppAsset=/\.(?:html|css|js|svg|png|webp|ico|json)$/i.test(url.pathname) || url.pathname.endsWith('/');
  if(!isAppAsset) return;
  event.respondWith(caches.match(request).then(cached=>cached || fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match('./index.html'))));
});
