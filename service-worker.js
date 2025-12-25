const CACHE_NAME = 'mizanak-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // ملفات Firebase الأساسية التي يستخدمها التطبيق
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics-compat.js',
];

// دالة تثبيت عامل الخدمة (Service Worker) وتخزين الأصول
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache:', error);
        });
      })
  );
});

// دالة جلب الأصول (Fetch)
self.addEventListener('fetch', event => {
  // للطلبات الداخلية، نحاول إرجاعها من الذاكرة المؤقتة أولاً
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // الرد من الذاكرة المؤقتة إذا كان متاحاً
        if (response) {
          return response;
        }
        // وإلا، نطلب الطلب من الشبكة
        return fetch(event.request);
      })
  );
});

// دالة تفعيل عامل الخدمة (لحذف الذاكرات المؤقتة القديمة)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
