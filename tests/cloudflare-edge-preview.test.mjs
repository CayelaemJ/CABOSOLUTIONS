import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../cloudflare/edge-preview.js';

function makeContext() {
  const pending = [];
  return { pending, waitUntil(promise) { pending.push(promise); } };
}
const url = path => 'https://cabo-solutions-edge-preview.cabo-solutions-za.workers.dev' + path;

test('private setup and unexpected paths cannot be exposed', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Should not call Render'); };
  try {
    for (const path of ['/zoho-setup', '/api/admin/enquiries', '/unknown', '/private']) {
      const res = await worker.fetch(new Request(url(path)), {}, makeContext());
      assert.equal(res.status, 404, path);
    }
    const invalid = await worker.fetch(new Request(url('/'), { method: 'POST' }), {}, makeContext());
    assert.equal(invalid.status, 405);
  } finally {
    globalThis.fetch = previous;
  }
});

test('site response has anonymous-only caching and does not forward cookies', async () => {
  const previousFetch = globalThis.fetch;
  const previousCaches = globalThis.caches;
  const saved = new Map();
  globalThis.caches = { default: {
    async match(request) { return saved.get(request.url)?.clone() ?? null; },
    async put(request, response) { saved.set(request.url, response.clone()); },
  }};
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.equal(new URL(input instanceof Request ? input.url : String(input)).hostname, 'cabo-solutions-site.onrender.com');
    const forwarded = input instanceof Request ? input.headers : new Headers(init?.headers);
    assert.equal(forwarded.get('cookie'), null);
    assert.equal(forwarded.get('authorization'), null);
    return new Response('<!doctype html><title>CABO</title>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'secret=never' },
    });
  };
  try {
    const context = makeContext();
    const first = await worker.fetch(new Request(url('/'), {
      headers: { Cookie: 'visitor=private', Authorization: 'Bearer do-not-forward' },
    }), {}, context);
    assert.equal(first.status, 200);
    assert.equal(first.headers.get('set-cookie'), null);
    assert.match(first.headers.get('x-robots-tag'), /noindex/);
    await Promise.all(context.pending);
    const second = await worker.fetch(new Request(url('/')), {}, makeContext());
    assert.equal(second.status, 200);
    assert.equal(await second.text(), '<!doctype html><title>CABO</title>');
    assert.equal(calls, 1, 'should use Cloudflare cache on second visit');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousCaches === undefined) delete globalThis.caches;
    else globalThis.caches = previousCaches;
  }
});

test('public enquiry POST is forwarded uncached and retains backend response status', async () => {
  const old = globalThis.fetch;
  let destination, headers, body;
  globalThis.fetch = async (input, init) => {
    destination = input instanceof Request ? input.url : String(input);
    headers = input instanceof Request ? input.headers : new Headers(init?.headers);
    body = input instanceof Request ? await input.text() : new TextDecoder().decode(init?.body);
    return Response.json({ received: true, reference: 'synthetic' }, { status: 201 });
  };
  try {
    const response = await worker.fetch(new Request(url('/api/enquiries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'never-forward',
        Authorization: 'Bearer never-forward',
      },
      body: JSON.stringify({ name: 'Synthetic Person', email: 'synthetic@example.test' }),
    }), {}, makeContext());
    assert.equal(response.status, 201);
    assert.equal(destination, 'https://cabo-solutions-site.onrender.com/api/enquiries');
    assert.equal(headers.get('cookie'), null);
    assert.equal(headers.get('authorization'), null);
    assert.match(body, /Synthetic Person/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  } finally {
    globalThis.fetch = old;
  }
});

test('enquiry requests reject wrong content types and over-limit bodies', async () => {
  const old = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Should not call backend'); };
  try {
    assert.equal((await worker.fetch(new Request(url('/api/enquiries'), {
      method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x',
    }), {}, makeContext())).status, 415);
    assert.equal((await worker.fetch(new Request(url('/api/enquiries'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'x'.repeat(33000),
    }), {}, makeContext())).status, 413);
  } finally {
    globalThis.fetch = old;
  }
});
