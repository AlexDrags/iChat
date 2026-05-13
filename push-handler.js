self.addEventListener('fetch', (event) => {
  // Игнорируем запросы, которые делает сам Service Worker
  if (event.request.referrer === event.request.url) {
    return // Не перехватываем внутренние запросы SW
  }

  // Логируем запрос для отладки
  console.log('Service Worker fetch:', event.request.method, event.request.url)

  // Проверяем, является ли это запросом к updatesubscription
  if (event.request.url.includes('updatesubscription')) {
    console.log('Special handling for updatesubscription request:', event.request.url)

    // Для запросов к updatesubscription используем более надежную обработку
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'include',
      })
        .then((response) => {
          console.log('updatesubscription response status:', response.status)
          return response
        })
        .catch((error) => {
          console.error('Service Worker fetch error for updatesubscription:', error)
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            request: event.request.url,
            method: event.request.method,
          })

          // Возвращаем пустой ответ вместо того, чтобы выбрасывать ошибку
          return new Response('Service Worker fetch failed', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        }),
    )
    return
  }

  // Всегда ходим в сеть, обходя кэш
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch((error) => {
      console.error('Service Worker fetch error:', error)
      throw error
    }),
  )
})

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
