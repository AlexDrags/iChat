window.frontgetmessageapi = {
  call: async function get() {
    const params = new URLSearchParams(window.location.hash.substring(1))
    const keys = params.get('keys')
    const envKeys = keys.split('|')
    const nocoKey = envKeys[0]
    const basicKey = envKeys[1]

    try {
      console.log('Запрос списка сообщений...')
      const msgRes = await fetch(
        'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/moz9mipdwe457yi/records?viewId=vwbtalrea3w83o7x&limit=1000&shuffle=0&offset=0&x_allow_headers=Authorization,xc-token',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${basicKey}`,
            'xc-token': nocoKey,
          },
        },
      )

      if (!msgRes.ok) {
        throw new Error(`HTTP ${msgRes.status}`)
      }
      console.log('Ответ списка сообщений получен, статус:', msgRes.status)
      const msgData = await msgRes.json()
      console.log('Ответ списка пользователей получен, данные:', msgData)
      return { messages: msgData }
    } catch (err) {
      console.error('Failed to get script:', err)
    }
  },
}
