const micro = require('micro');
const test = require('ava');
const listen = require('test-listen').default;
const request = require('request-promise');
const wordpress_service = require('../index.js');

test('my endpoint', async t => {
  const service = micro(wordpress_service);
  const url = await listen(service);
  const body = await request(url);
  t.deepEqual(JSON.parse(body).message, 'Hello!');
});
