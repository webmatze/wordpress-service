const micro = require('micro')
const test = require('ava')
const listen = require('test-listen').default
const request = require('request-promise')
const wordpressService = require('../index.js')
const service = micro(wordpressService)
const {StatusCodeError} = require('request-promise-core/errors')

test.beforeEach(async (t) => {
    t.context.url = await listen(service)
})

test('throws Unauthorized error without credentials', async (t) => {
  try {
    let response = await request(t.context.url)
  } catch(error) {
    t.is(error.statusCode, 401)
  }
})

test('throws Date missing error without url', async (t) => {
  try {
    let response = await request({
      url: t.context.url,
      qs: {
        username: 'test',
        password: 'test'
      }
    })
  } catch(error) {
    t.is(error.statusCode, 412)
  }
})

test('returns success with all required data', async (t) => {
  const body = await request({
    url: t.context.url,
    qs: {
      username: 'test',
      password: 'test',
      url: 'http://url.de'
    }
  })
  t.deepEqual(JSON.parse(body).message, 'Hello!')
})
