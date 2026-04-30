import { buildPushPayload } from '@block65/webcrypto-web-push'

window.frontpostapi = {
  call: async function post() {
    // call: async function post(id, message, img = null, subscriptionData) {

    let msgParams = new URLSearchParams(document.location.search)
    let id = msgParams.get('userId')
    console.log('userId:', id)
    let message = msgParams.get('text')
    console.log('text:', message)
    let img = msgParams.get('img')
    console.log('img:', img)
    let subscriptionData = JSON.parse(msgParams.get('currentSubscription'))
    console.log('subscriptionData:', subscriptionData)

    const params = new URLSearchParams(window.location.hash.substring(1))
    const keys = params.get('keys')
    const envKeys = keys.split('|')
    const nocoKey = envKeys[0]
    const basicKey = envKeys[1]
    const publicKey = envKeys[2]
    const privateKey = envKeys[3]
    // console.log(nocoKey, basicKey, publicKey, privateKey, id, message, img, subscriptionData)
    try {
      console.log('Отправка сообщения "', message, '" от пользователя: ', id, '...')

      const sendRes = await fetch(
        'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/moz9mipdwe457yi/records?viewId=vwbtalrea3w83o7x&limit=1000&shuffle=0&offset=0&x_allow_headers=Authorization,xc-token,Content-Type&x_http_method_override=POST',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicKey}`,
            'xc-token': nocoKey,
          },
          body: JSON.stringify({
            user_id: id,
            text: message,
            image: img,
          }),
        },
      )

      if (!sendRes.ok) {
        throw new Error(`HTTP ${sendRes.status}`)
      }

      {
        console.log('Отправка push уведомления...', message, subscriptionData)

        const vapid = {
          subject: 'mailto:your-email@yourdomain.org',
          publicKey: publicKey,
          privateKey: privateKey,
        }

        const subscription = {
          endpoint: subscriptionData.endpoint,
          expirationTime: null,
          keys: {
            p256dh: subscriptionData.keys.p256dh,
            auth: subscriptionData.keys.auth,
          },
        }

        const jsonMessageData = JSON.stringify({
          title: 'Новое сообщение:',
          body: message,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-128x128.png',
          vibrate: [200, 100, 200],
          data: {
            url: '/',
          },
        })

        const pushMessage = {
          data: jsonMessageData,
          options: {
            ttl: 60,
          },
        }

        const payload = await buildPushPayload(pushMessage, subscription, vapid)
        const prepareEndpoint = subscription.endpoint.replace('https://', '')

        const notificRes = await fetch(
          `https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/${prepareEndpoint}?x_allow_headers=Authorization,Content-Type,Content-Encoding,Encryption,Crypto-Key,TTL`,
          payload,
        )

        if (!notificRes.ok) {
          throw new Error(`HTTP ${notificRes.status}`)
        }

        console.log('Отправка уведомления выполнена, статус:', notificRes.status)
      }

      console.log('Отправка сообщени выполнена, статус:', sendRes.status)
      const data = await sendRes.json()
      console.log(data)
      return data
    } catch (error) {
      console.error('Failed to post script:', error)
    }
  },
}
