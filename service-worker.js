// 서비스 워커 캐시 이름
const CACHE_NAME = 'lcbakery-v1';

// 캐시할 리소스 목록
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './image/lclogo.png',
  './image/lclogobg.png',
  './image/lc1.jpg',
  './image/lc2.jpg',
  './image/lc3.jpg',
  './image/lc4.jpg',
  './image/lcbr1.jpg',
  './image/lcbr2.jpg',
  './image/lcbr3.jpg',
  './image/ing1.jpg',
  './image/ing2.jpg',
  './image/ing3.jpg',
];

// 서비스 워커 설치 시 캐시 추가
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 네트워크 요청을 가로채서 캐시된 응답 반환
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크 요청
        return fetch(event.request)
          .then(response => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답 복제 (스트림이므로 한 번만 사용 가능)
            const responseToCache = response.clone();
            
            // 응답 캐싱
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// 이전 캐시 삭제
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