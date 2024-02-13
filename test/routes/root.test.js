import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../helper.js';

test('default root route', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: '/',
  });
  assert.equal(res.statusCode, 302);
  assert.equal(res.headers.location, '/api-docs');
});
