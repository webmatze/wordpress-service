const wordpress = require('wordpress')
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
  let data = null

  try {
    data = await json(request)
  } catch (e) {
    return send(response, 400, { error: 'no post data provided' })
  }

  if (!data.auth || !data.auth.username || !data.auth.password) {
    return send(response, 401, { error: 'no login credentials provided' })
  }

  state.wordpress.username = data.auth.username
  state.wordpress.password = data.auth.password

  if (!data.auth.url) {
    return send(response, 412, { error: 'no url provided' })
  }

  state.wordpress.url = data.auth.url

  const client = wordpress.createClient(state.wordpress)

  state.post = Object.assign(state.post, data.post)

  client.newPost(state.post, function (error, id) {
    send(response, 200, { error, id })
  })
}
