const wordpress = require('wordpress')
const { parse } = require('url')
const { json, send } = require('micro')

let state = {
  wordpress: {
    username: null,
    password: null,
    url: null
  },
  post: {
    title: 'No Title',
    excerpt: 'No Excerpt',
    content: 'No Content',
    status: 'publish'
  }
}

module.exports = async function (request, response) {
  const data = await json(request)

  if (!data.auth || !data.auth.username || !data.auth.password) {
    let noCredentialsError = new Error('no login credentials provided')
    noCredentialsError.statusCode = 401
    throw noCredentialsError
  }

  state.wordpress.username = data.auth.username
  state.wordpress.password = data.auth.password

  if (!data.auth.url) {
    let noUrlError = new Error('no url provided')
    noUrlError.statusCode = 412
    throw noUrlError
  }

  state.wordpress.url = data.auth.url

  const client = wordpress.createClient(state.wordpress)

  state.post = Object.assign(state.post, data.post)

  client.newPost(state.post, function( error, id ) {
    console.log(error)
    console.log(id)
  })
 
  return { message: 'Hello!' }
}
