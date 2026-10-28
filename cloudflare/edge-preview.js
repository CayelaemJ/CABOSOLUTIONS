// CABO Solutions Cloudflare edge preview (not the final migrated backend).
// Caches *public* site HTML/assets. Never caches enquiry/API responses or
// exposes the Render administrative setup UI.
const ORIGIN = 'https://cabo-solutions-site.onrender.com';
const STATIC = /^\/(?:assets|images)\/[a-zA-Z0-9._~!$&'()+,;=:@%/-]+$/;
const PUBLIC_FILES = new Set(['/', '/favicon.ico', '/robots.txt', '/sitemap.xml']);
const MIME = ['content-type', 'etag', 'last-modified', 'content-language'];

function safeHeaders(status, json = false) {
  const headers = new Headers({
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  if (json) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
  }
  return headers;
}
function failure(status, message) {
  return new Response(JSON.stringify({ error: message }), { status, headers: safeHeaders(status, true) });
}
async function api(request, path) {
  if (path === '/api/health' && request.method === 'GET') {
    try {
      const upstream = await fetch(ORIGIN + path, { redirect: 'manual', cf: { cacheTtl: 0 } });
      return new Response(upstream.body, {
        status: upstream.status,
        headers: new Headers({
          ...Object.fromEntries([...safeHeaders(200, true)]),
          'Content-Type': 'application/json; charset=utf-8',
        }),
      });
    } catch { return failure(502, 'Backend unavailable'); }
  }
  if (path !== '/api/enquiries' || request.method !== 'POST') return failure(404, 'Not found');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return failure(415, 'Expected JSON');
  const indicated = Number(request.headers.get('content-length') || 0);
  if (!Number.isFinite(indicated) || indicated > 32768) return failure(413, 'Request too large');
  try {
    const body = await request.arrayBuffer();
    if (body.byteLength > 32768) return failure(413, 'Request too large');
    const upstream = await fetch(ORIGIN + path, {
      method: 'POST',
      body,
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json' },
      cf: { cacheTtl: 0 },
    });
    if (upstream.status >= 300 && upstream.status < 400) return failure(502, 'Unexpected backend redirect');
    const headers = safeHeaders(upstream.status, true);
    const retry = upstream.headers.get('retry-after');
    if (retry) headers.set('Retry-After', retry);
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch { return failure(502, 'Enquiry service temporarily unavailable'); }
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith('/api/')) return api(request, path);
    if (!['GET','HEAD'].includes(request.method)) return failure(405, 'Method not allowed');
    if (!PUBLIC_FILES.has(path) && !STATIC.test(path)) return failure(404, 'Not found');

    // Only anonymous, public content is eligible for caching.
    // Never pass user cookies, Authorization or forwarded client IP to Render.
    const cacheUrl = new URL(url.origin + path);
    const key = new Request(cacheUrl.toString(), { method: 'GET' });
    const edgeCache = caches.default;
    let response = await edgeCache.match(key);
    if (!response) {
      try {
        const origin = new URL(path, ORIGIN);
        const upstream = await fetch(origin, {
          method: 'GET', redirect: 'manual',
          headers: { 'Accept': path === '/' ? 'text/html' : '*/*' },
        });
        if (upstream.status !== 200) return failure(502, 'Public site origin unavailable');
        const type = upstream.headers.get('content-type') || '';
        if (path === '/' && !type.includes('text/html')) return failure(502, 'Invalid site response');
        const headers = safeHeaders(200);
        for (const name of MIME) {
          const value = upstream.headers.get(name);
          if (value) headers.set(name, value);
        }
        headers.set('Cache-Control', path === '/' ? 'public, max-age=300' : 'public, max-age=86400');
        response = new Response(upstream.body, { status: 200, headers });
        ctx.waitUntil(edgeCache.put(key, response.clone()).catch(() => {}));
      } catch { return failure(502, 'Public site temporarily unavailable'); }
    }
    return request.method === 'HEAD'
      ? new Response(null, { status: response.status, headers: response.headers })
      : response;
  },
};
