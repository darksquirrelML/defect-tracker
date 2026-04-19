// Defect Tracker Service Worker v2.1
var CACHE = 'defect-tracker-v2';
var ASSETS = [
  '/defect-tracker/',
  '/defect-tracker/index.html',
  '/defect-tracker/manifest.json',
  '/defect-tracker/icon-192.png',
  '/defect-tracker/icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  if(e.request.url.includes('supabase.co')||e.request.url.includes('cdnjs')||e.request.url.includes('fonts.googleapis')){
    e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
  } else {
    e.respondWith(
      caches.match(e.request).then(function(r){ return r || fetch(e.request); })
    );
  }
});
