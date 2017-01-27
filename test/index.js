const micro = require('micro')
const test = require('ava')
const listen = require('test-listen').default
const request = require('request-promise')
const wordpressService = require('../index.js')
const service = micro(wordpressService)

test.beforeEach(async (t) => {
  t.context.url = await listen(service)
})

test('throws Unauthorized error without credentials', async (t) => {
  const error = await t.throws(request(t.context.url))
  t.is(error.statusCode, 401)
})

test('returns success with credentials', async (t) => {
  const body = await request({
    url: t.context.url,
    qs: {
      username: 'test',
      password: 'test'
    }
  })
  t.deepEqual(JSON.parse(body).message, 'Hello!')
})
