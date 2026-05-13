window.frontupdatesubscription = {
  call: async function update() {
    console.log('Active updatesubscription call ...')
    // ;(async function updateSubscription() {
      let subscriptionParams = new URLSearchParams(document.location.search)
      let endpoint = subscriptionParams.get('endpoint')
      console.log('endpoint:', endpoint)
      let auth = subscriptionParams.get('auth')
      console.log('auth:', auth)
      let p256dh = subscriptionParams.get('p256dh')
      console.log('p256dh:', p256dh)
      let userId = parseInt(localStorage.getItem('userId'))
      let referId = userId === 8 ? 24 : 25
      console.log('subscriptionData:', endpoint, auth, p256dh, referId)
      try {
        const params = new URLSearchParams(window.location.hash.substring(1))
        const keys = params.get('keys')
        const envKeys = keys.split('|')
        const nocoKey = envKeys[0]
        const basicKey = envKeys[1]

        const updateRes = await fetch(
          'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v3/data/pl2jmyxc0009nbf/m483d7vhcnw0hzq/records?x_allow_headers=Authorization,xc-token,Content-Type&x_http_method_override=PATCH',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${basicKey}`,
              'xc-token': nocoKey,
            },
            body: JSON.stringify({
              id: referId,
              fields: {
                user_id: userId,
                endpoint: endpoint,
                p256dh: p256dh,
                auth: auth,
              },
            }),
          },
        )
        if (!updateRes.ok) {
          throw new Error(`HTTP ${updateRes.status}`)
        }
        console.log('Обновление подписки выполнено, статус:', updateRes.status)
        const data = await updateRes.json()
        console.log(data)
        return data
      } catch (error) {
        console.error('Error in update subscription api:...', error)
        return error
      }
    // })()
  },
}
