window.failtesttechapi = {
  call: async function update() {
    console.log('Active failtesttechapi call ...')
    // ;(async function failUpdateSubscription() {
      try {
        const params = new URLSearchParams(window.location.hash.substring(1))
        const keys = params.get('keys')
        const envKeys = keys.split('|')
        const nocoKey = envKeys[0]
        const basicKey = envKeys[1]
        const randomNumb = Math.floor(Math.random() * 99)

        const failTestRes = await fetch(
          'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v3/data/pl2jmyxc0009nbf/m483d7vhcnw0hzq/records?x_allow_headers=Authorization,xc-token,Content-Type&x_http_method_override=PATCH',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${basicKey}`,
              'xc-token': nocoKey,
            },
            body: JSON.stringify({
              id: 28,
              fields: {
                user_id: 999,
                endpoint: `failTest endpoint - ${randomNumb}`,
                p256dh: `failTest p256dh - ${randomNumb}`,
                auth: `failTest auth - ${randomNumb}`,
              },
            }),
          },
        )
        if (!failTestRes.ok) {
          throw new Error(`HTTP ${failTestRes.status}`)
        }
        console.log('failTestRes выполнено, статус:', failTestRes.status)
        const data = await failTestRes.json()
        console.log('data in failtesttechapi.js : ', data)
        return data
      } catch (error) {
        console.error('Error in update subscription api:...', error)
        return error
      }
    // })()
  },
}
