const micro = require('micro')
const test = require('ava')
const listen = require('test-listen').default
const request = require('request-promise')
const mockery = require('mockery')

test.before(t => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  })
  const wordpressMock = {
    createClient (config) {
      return {
        newPost (data, fn) {
          return Promise.resolve().then(() => {
            return fn(null, '1')
          })
        }
      }
    }
  }
  mockery.registerMock('wordpress', wordpressMock)
})

test.beforeEach(async (t) => {
  const wordpressService = require('../index.js')
  const service = micro(wordpressService)
  t.context.url = await listen(service)
})

test('throws NoBody error without POST body', async (t) => {
  try {
    await request(t.context.url)
  } catch (error) {
    t.is(error.statusCode, 400)
  }
})

test('throws Unauthorized error without credentials', async (t) => {
  try {
    await request({
      method: 'POST',
      url: t.context.url,
      body: {
        test: true
      },
      json: true
    })
  } catch (error) {
    t.is(error.statusCode, 401)
  }
})

test('throws Authentication Data missing error without url', async (t) => {
  try {
    await request({
      method: 'POST',
      url: t.context.url,
      body: {
        auth: {
          username: 'test',
          password: 'test'
        }
      },
      json: true
    })
  } catch (error) {
    t.is(error.statusCode, 412)
  }
})

test('returns success with all required data', async (t) => {
  const body = await request({
    method: 'POST',
    url: t.context.url,
    body: {
      auth: {
        username: 'test',
        password: 'test',
        url: 'http://url.de'
      }
    },
    json: true
  })
  t.deepEqual(body.id, '1')
})
