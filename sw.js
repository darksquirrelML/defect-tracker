var CACHE = 'defect-tracker-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// Install — cache assets
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS).catch(function(err){
        console.log('Cache failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', function(e){
  // Don't cache Supabase API calls
  if(e.request.url.indexOf('supabase.co')>=0) return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(response){
        // Cache new requests
        if(response.ok && e.request.method==='GET'){
          var clone=response.clone();
          caches.open(CACHE).then(function(cache){ cache.put(e.request, clone); });
        }
        return response;
      }).catch(function(){
        return cached || new Response('Offline - please connect to internet', {status:503});
      });
    })
  );
});
