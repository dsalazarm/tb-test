const APP_NAME = 'Files Handler API'
const ENV = process.env.NODE_ENV || 'dev'
const PORT = process.env.PORT || 8080

/**
 * Configuration middleware to enable cors and set some other allowed headers.
 *  You can also just use the 'cors' package.
 */
function globalResponseHeaders (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  )
  response.header(
    'Access-Control-Allow-Methods',
    'POST,GET,PATCH,DELETE,OPTIONS'
  )
  response.header('Content-Type', 'application/json')
  return next()
}

const INTEGRATIONS = {
  tbxNet: {
    name: '',
    url: 'https://echo-serv.tbxnet.com',
    apiVersion: 'v1',
    defaultAuthToken: 'aSuperSecretKey',
    defaultAuthType: 'Bearer',
    defaultTimeout: 10000
  }
}

module.exports = {
  APP_NAME,
  ENV,
  PORT,
  INTEGRATIONS,
  globalResponseHeaders
}
