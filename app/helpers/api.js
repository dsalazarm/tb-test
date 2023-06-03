const axios = require('axios').default

module.exports = (config) => {
  const { url, apiVersion, defaultAuthType, defaultAuthToken, defaultTimeout } = config

  const baseURL = url && apiVersion ? `${url}/${apiVersion}/` : `${url}/`
  const result = axios.create({
    baseURL,
    timeout: defaultTimeout || 10000
  })

  if (defaultAuthType && defaultAuthToken) {
    result.defaults.headers.common.Authorization = `${defaultAuthType} ${defaultAuthToken}`
  }

  return result
}
