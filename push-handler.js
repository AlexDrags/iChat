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
      const notificationOptions = {
        body: pushData.body || 'Новое сообщение',
        icon: pushData.icon || '/icon-192x192.png',
        badge: pushData.badge || '/badge-72x72.png',
        image: pushData.image,
        tag: pushData.tag || 'default',
        data: pushData.data,
        requireInteraction: pushData.requireInteraction || false,
        silent: pushData.silent || false,
        vibrate: pushData.vibrate || [200, 100, 200],
        timestamp: Date.now(),
        actions: pushData.actions || [],
      }
      self.registration.showNotification(pushData.title, pushData)
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
