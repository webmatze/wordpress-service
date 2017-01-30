const wordpress = require('wordpress')
const { parse } = require('url')

let state = {
  wordpress: {
    username: null,
    password: null,
    url: null
  }
}

module.exports = function (request, response) {
  const { query } = parse(request.url, true)

  if (!query.username || !query.password) {
    let noCredentialsError = new Error('no login credentials provided')
    noCredentialsError.statusCode = 401
    throw noCredentialsError
  }

  if (!query.url) {
    let noUrlError = new Error('no url provided')
    noUrlError.statusCode = 412
    throw noUrlError
  }

  //const client = wordpress.createClient({
    
  //})
 
  return { message: 'Hello!' }
}
