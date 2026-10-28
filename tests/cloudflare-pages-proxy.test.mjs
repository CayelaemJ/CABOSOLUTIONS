import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/[[path]].js';

const run = (path, options = {}) =>
  onRequest({ request: new Request('https://preview.pages.dev' + path, options) });

test('unknown paths and methods never reach the origin', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Unexpected network request'); };
  try {
    assert.equal((await run('/api/does-not-exist')).status, 404);
    assert.equal((await run('/api/enquiries', { method: 'GET' })).status, 405);
    assert.equal((await run('/api/admin/enquiries/abc', { method: 'PATCH' })).status, 404);
  } finally {
    globalThis.fetch = original;
  }
});

test('valid public enquiry keeps the path and cannot forward cookies', async () => {
  const original = globalThis.fetch;
  let received;
  globalThis.fetch = async input => {
    received = input;
    return Response.json({ received: true, reference: '1' }, { status: 201 });
  };
  try {
    const response = await run('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'session=should-not-leak',
        Authorization: 'Bearer should-not-leak',
        'X-Forwarded-For': '1.2.3.4',
      },
      body: JSON.stringify({ name: 'Test', email: 'test@example.test' }),
    });
    assert.equal(response.status, 201);
    assert.equal(received.url, 'https://cabo-solutions-site.onrender.com/api/enquiries');
    assert.equal(received.headers.get('cookie'), null);
    assert.equal(received.headers.get('authorization'), null);
    assert.equal(received.headers.get('x-forwarded-for'), null);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  } finally {
    globalThis.fetch = original;
  }
});

test('admin authentication is forwarded only for approved admin API routes', async () => {
  const original = globalThis.fetch;
  let received;
  globalThis.fetch = async input => {
    received = input;
    return Response.json({ enquiries: [] });
  };
  try {
    const response = await run('/api/admin/enquiries', {
      headers: { Authorization: 'Bearer example-test-token' },
    });
    assert.equal(response.status, 200);
    assert.equal(received.headers.get('authorization'), 'Bearer example-test-token');
  } finally {
    globalThis.fetch = original;
  }
});

test('upstream redirect is blocked and failures are not mistaken for success', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () =>
      new Response(null, { status: 302, headers: { Location: 'https://example.test' } });
    assert.equal((await run('/api/health')).status, 502);
    globalThis.fetch = async () => { throw new Error('Unreachable'); };
    assert.equal((await run('/api/health')).status, 502);
  } finally {
    globalThis.fetch = original;
  }
});
