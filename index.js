const wordpress = require('wordpress')
const { parse } = require('url')

module.exports = function (request, response) {
  const { query } = parse(request.url, true)

  if (!query.username || !query.password) {
    let noCredentialsError = new Error('no login credentials provided')
    noCredentialsError.statusCode = 401
    throw noCredentialsError
  }
  return { message: 'Hello!' }
}
