const C='haic-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(
    fetch(u.href,{cache:'no-cache'}).then(res=>{
      const copy=res.clone();
      caches.open(C).then(c=>c.put(r,copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  );
});
