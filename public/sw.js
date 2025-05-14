const CACHE_NAME = 'tower-of-networks-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.ts', // 注意：Vite/TypeScript 项目通常会将 .ts 编译为 .js
                  // 实际缓存的路径可能需要根据构建输出调整
  // 图标路径 (相对于 public 目录)
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png',
  'manifest.json',
  // 其他需要缓存的静态资源，例如 vite.svg, typescript.svg
  'vite.svg',
  // 'typescript.svg' // 根据项目实际情况，如果 src/typescript.svg 是通过 JS 动态加载或 CSS background-image,
                   // 它可能不会直接通过 /typescript.svg 访问。
                   // 如果它是 index.html 中直接引用的 <img> src, 则可以这样缓存。
                   // 对于 Vite 项目，通常静态资源会被打包到 dist 目录，路径会变化。
                   // 此处暂时假设它可以直接访问。
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // 注意：对于 Vite 开发服务器，main.ts 不会直接在根路径下。
        // 生产构建后，文件名和路径可能会改变 (例如，包含哈希值)。
        // 一个更健壮的 Service Worker 会在构建过程中生成预缓存列表。
        // 这里我们假设一个简化的场景。
        return cache.addAll(urlsToCache.map(url => {
          // 对于 Vite 开发服务器，src 下的文件通常通过 /src/ 路径访问
          if (url.startsWith('/src/')) {
            return url;
          }
          // 确保根路径下的文件正确
          if (url === '/index.html' || url === '/') {
            return url;
          }
          // public 目录下的文件直接从根路径访问
          if (urlsToCache.includes(url) && !url.startsWith('/src/') && !url.startsWith('icons/')) {
             // vite.svg, manifest.json 等
            return '/' + url;
          }
          return url; // 对于 icons/ 和其他已正确指定的路径
        }).filter(url => !!url)); // 过滤掉可能的 undefined
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

// 激活 Service Worker，并清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中存在，则返回缓存的响应
        if (response) {
          return response;
        }
        // 否则，从网络获取，并缓存新的响应
        return fetch(event.request).then(
          networkResponse => {
            // 检查我们是否收到了有效的响应
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // 重要：克隆响应。响应是一个流，只能被消费一次。
            // 我们需要一份给浏览器使用，一份给缓存使用。
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetching failed:', error);
          // 可以考虑返回一个自定义的离线页面
          // return caches.match('/offline.html');
          throw error;
        });
      })
  );
});
