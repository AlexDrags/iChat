window.frontupdatesubscription = {
  call: async function update() {
    console.log('Active updatesubscription call ...')

    // Проверяем наличие необходимых параметров
    let subscriptionParams = new URLSearchParams(document.location.search)
    let userId = parseInt(subscriptionParams.get('id'))
    let endpoint = subscriptionParams.get('endpoint')
    console.log('endpoint:', endpoint)
    let auth = subscriptionParams.get('auth')
    console.log('auth:', auth)
    let p256dh = subscriptionParams.get('p256dh')
    console.log('p256dh:', p256dh)

    // Проверяем наличие обязательных параметров
    if (!endpoint || !auth || !p256dh) {
      const error = new Error('Missing required subscription parameters')
      console.error('Error in update subscription api:', error)
      return { error: error.message, missingParams: { endpoint, auth, p256dh } }
    }

    if (!userId) {
      const error = new Error('User ID not found in localStorage')
      console.error('Error in update subscription api:', error)
      return { error: error.message }
    }

    let referId = userId === 8 ? 24 : 25
    console.log('subscriptionData:', endpoint, auth, p256dh, referId)

    try {
      const params = new URLSearchParams(window.location.hash.substring(1))
      const keys = params.get('keys')

      if (!keys) {
        const error = new Error('API keys not found in URL hash')
        console.error('Error in update subscription api:', error)
        return { error: error.message }
      }

      const envKeys = keys.split('|')
      const nocoKey = envKeys[0]
      const basicKey = envKeys[1]

      console.log('Making API call to update subscription...')
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

      console.log('API response status:', updateRes.status)

      if (!updateRes.ok) {
        const errorText = await updateRes.text()
        console.error('API response error:', errorText)
        throw new Error(`HTTP ${updateRes.status}: ${errorText}`)
      }

      console.log('Обновление подписки выполнено, статус:', updateRes.status)
      const data = await updateRes.json()
      console.log('API response data:', data)
      return data
    } catch (error) {
      console.error('Error in update subscription api:...', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        endpoint: endpoint,
        userId: userId,
        referId: referId,
      })
      return { error: error.message, details: error.stack }
    }
  },
}
