// Minimal service worker: lets Chrome install Focaude as an app.
// Network first, so you always get the latest version; falls back to cache offline.
const C='focaude-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(/\.(mp3|wav|ogg|m4a)$/i.test(u.pathname)||e.request.headers.has('range'))return;   // let the browser stream audio itself (range requests, looping)
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
