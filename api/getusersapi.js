window.frontgetusersapi = {
  call: async function get() {
    // const params = new URL(window.location.href).hash.slice(3).split('|')
    // const env = localStorage.getItem('__frontapi_env_vars')
    //   ? JSON.parse(localStorage.getItem('__frontapi_env_vars'))
    //   : {}
    const hashSubstring = window.location.hash.substring(1, 249)
    console.log('hashSubstring:', hashSubstring)
    const decode = decodeURIComponent(hashSubstring)
    console.log('decode: ', decode)
    const env = JSON.parse(decode)

    console.log('env:', env)
    console.log('Запуск функции getusersapi...', env['keys'])
    const envArray = env['keys'].split('|')
    console.log('Полученные параметры:', env)
    const nocoKey = envArray[0]
    const basicKey = envArray[1]
    console.log(nocoKey, basicKey)
    try {
      console.log('Запрос списка пользователей...')
      const usersRes = await fetch(
        'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/m3amjp4d1rmzzke/records?viewId=vwrnbfvzjhl3o2sa&limit=25&shuffle=0&offset=0&x_allow_headers=Authorization,xc-token',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${basicKey}`,
            'xc-token': nocoKey,
          },
        },
      )
      // console.log('Запрос списка сообщений...')
      // const msgRes = await fetch(
      //   'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/moz9mipdwe457yi/records?viewId=vwbtalrea3w83o7x&limit=1000&shuffle=0&offset=0&x_allow_headers=Authorization,xc-token',
      //   {
      //     method: 'GET',
      //     headers: {
      //       Accept: 'application/json',
      //       Authorization: `Basic ${basicKey}`,
      //       'xc-token': nocoKey,
      //     },
      //   },
      // )
      // console.log('Запрос наличия подписки пользователей...')
      // const subsRes = await fetch(
      //   'https://alexdrags-ichat-frontapi.ch.daturum.ru/cors/https/nocodb-34be9a.ch.daturum.ru/api/v2/tables/m483d7vhcnw0hzq/records?viewId=vw899ht6am0vzep5&limit=25&shuffle=0&offset=0&x_allow_headers=Authorization,xc-token',
      //   {
      //     method: 'GET',
      //     headers: {
      //       Accept: 'application/json',
      //       Authorization: `Basic ${basicKey}`,
      //       'xc-token': nocoKey,
      //     },
      //   },
      // )

      if (!usersRes.ok) {
        throw new Error(`HTTP ${usersRes.status}`)
      }
      console.log('Ответ списка пользователей получен, статус:', usersRes.status)
      const usersData = await usersRes.json()
      console.log('Ответ списка пользователей получен, данные:', usersData)
      // console.log('Ответ списка сообщений получен, статус:', msgRes.status)
      // const msgData = await msgRes.json()
      // console.log('Ответ на наличия подписки пользователей получен, статус:', subsRes.status)
      // const subsData = await subsRes.json()

      return { users: usersData }
      // return { users: usersData, messages: msgData, subscriptions: subsData }
    } catch (err) {
      console.error('Failed to get script:', err)
    }
  },
}
