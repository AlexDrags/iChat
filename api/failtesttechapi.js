window.failtesttechapi = {
  call: async function update() {
    console.log('Active failtesttechapi call ...')
    ;(async function updateSubscription() {
      try {
        const params = new URLSearchParams(window.location.hash.substring(1))
        const keys = params.get('keys')
        const envKeys = keys.split('|')
        const nocoKey = envKeys[0]
        const basicKey = envKeys[1]

        const updateRes = await fetch(
          'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/m483d7vhcnw0hzq/records/27',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${basicKey}`,
              'xc-token': nocoKey,
            },
            body: JSON.stringify({
              user_id: 1,
              endpoint: 'message',
              p256dh: 'p256dh',
              auth: 'img',
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
    })()
  },
}
