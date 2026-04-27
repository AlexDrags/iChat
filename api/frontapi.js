window.frontapi = {
  env_vars_in_location_hash_enabled: true,
  debug_frame_timeout: 8000,
  call: async function (action, params = {}, method = 'POST', headers = {}) {
    // For DEBUG we save cookies in ls as when developing with local files js cookies are not stored
    const reqId = '_' + crypto.randomUUID()
    var env = { reqId: reqId, method: method, headers: JSON.stringify(headers) }
    const cookiePrefix = '_fapi_'
    env.cookies = JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter((a) => a[0].startsWith(cookiePrefix))
          .map((a) => [a[0].substring(cookiePrefix.length), a[1]]),
      ),
    )
    env.ip = '127.0.0.1'

    const env_vars_hash = this.env_vars_in_location_hash_enabled
      ? JSON.stringify(Object.fromEntries(new URLSearchParams(window.location.hash.substring(3))))
      : ''
    console.log('env_vars_hash:', env_vars_hash)
    const env_vars_ls_key = '__frontapi_env_vars'
    window.localStorage.setItem('__frontapi_env_vars', env_vars_hash)
    const env_vars_ls = window.localStorage.getItem(env_vars_ls_key)
    if (env_vars_hash && env_vars_hash != env_vars_ls)
      window.localStorage.setItem(env_vars_ls_key, env_vars_hash)
    const env_vars = env_vars_hash || env_vars_ls || ''

    var url = `api/${action}.html?${new URLSearchParams(params)}#${env_vars}&${new URLSearchParams(env)}`
    console.log('FrontAPI call with url:', url)
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.id = reqId
    iframe.className = 'frontapi-req-frame'
    if (this.debug_frame_timeout == 0) iframe.style = 'display: none;'
    iframe.sandbox = 'allow-scripts allow-same-origin'
    var resolved = false
    document.body.appendChild(iframe)
    return new Promise((resolve, reject) => {
      window.addEventListener('message', (msg) => {
        resolved = true
        if (msg.data.__setSecureHttpOnlyCookies) {
          Object.entries(msg.data.__setSecureHttpOnlyCookies).forEach((a) => {
            localStorage.setItem(`${cookiePrefix}${a[0]}`, a[1])
          })
        }
        resolve(msg.data)
      })

      setTimeout(() => {
        if (resolved) document.body.removeChild(iframe)
        else {
          reject(`Timeout on frontapi # ${reqId}`)
          iframe.style.background = 'pink'
        }
      }, this.debug_frame_timeout)
    })
  },
}
