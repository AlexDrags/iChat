// self.addEventListener('fetch', (event) => {
//   // Если запрос к API - всегда ходим в сеть
//   if (event.request.url.includes('/api/')) {
//     event.respondWith(fetch(event.request))
//     return
//   }
//   // Для остальных запросов используем стандартную логику
//   // (они будут обработаны Workbox'ом)
// })

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  console.log('Подписка на событие push...')
  if (event.data) {
    try {
      const pushData = event.data.json()
      // console.log('pushData', pushData)
      // const notificationOptions = {
      //   title: pushData.title || 'Новое сообщение',
      //   body: pushData.body || 'Новое сообщение',
      //   icon: pushData.icon || '/icon-192x192.png',
      //   badge: pushData.badge || '/badge-72x72.png',
      //   image: pushData.image,
      //   tag: pushData.tag || 'default',
      //   data: pushData.data,
      //   requireInteraction: pushData.requireInteraction || false,
      //   silent: pushData.silent || false,
      //   vibrate: pushData.vibrate || [200, 100, 200],
      //   timestamp: Date.now(),
      //   actions: pushData.actions || [],
      // }

      const notificationOptions = {
        body: pushData.body || 'Новое сообщение',
        icon: pushData.icon || '/icons/icon-192x192.png',
        badge: pushData.badge || '/icons/icon-128x128.png',
        data: pushData.data,
        vibrate: pushData.vibrate || [200, 100, 200],
      }
      self.registration.showNotification(pushData.title || 'Новое сообщение', notificationOptions)
    } catch (error) {
      console.error('Push notification error:', error)
    }
  }
})

self.addEventListener('notificationclick', (event) => {
  console.log('Уведомление закрыто')
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          data: event.notification.data,
        })
      })
    }),
  )
})
