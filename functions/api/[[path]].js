// Transitional Cloudflare Pages Function. The public site is static on Pages,
// while the existing Render API remains the source of truth for enquiries.
// Do not change the origin without an audited database and email migration.
const ORIGIN = 'https://cabo-solutions-site.onrender.com';

const jsonError = (status, error, headers = {}) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });

function allowedMethods(path) {
  if (path === '/api/health') return ['GET'];
  if (path === '/api/enquiries') return ['POST'];
  if (path === '/api/admin/enquiries') return ['GET'];
  if (/^\/api\/admin\/enquiries\/[0-9]+$/.test(path)) return ['PATCH'];
  return null;
}

export async function onRequest({ request }) {
  const input = new URL(request.url);
  const methods = allowedMethods(input.pathname);
  if (!methods) return jsonError(404, 'Not found');
  if (!methods.includes(request.method)) {
    return jsonError(405, 'Method not allowed', { Allow: methods.join(', ') });
  }

  // Restrict the forwarded headers: no browser cookies, client-supplied
  // proxy identity, or authorization on unauthenticated routes.
  const headers = new Headers();
  for (const name of ['content-type', 'accept']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (input.pathname.startsWith('/api/admin/')) {
    const auth = request.headers.get('authorization');
    if (auth) headers.set('authorization', auth);
  }

  const declaredSize = Number(request.headers.get('content-length') || 0);
  if (!Number.isFinite(declaredSize) || declaredSize > 65536) {
    return jsonError(413, 'Request too large');
  }

  // Fixed, verified destination. The visitor cannot choose a proxy target.
  const destination = new URL(input.pathname + input.search, ORIGIN);
  try {
    const upstreamRequest = new Request(destination, {
      method: request.method,
      headers,
      body: request.method === 'POST' || request.method === 'PATCH'
        ? request.body
        : undefined,
      redirect: 'manual',
      // Required by Node's Request implementation for streamed bodies;
      // supported by the Workers runtime.
      duplex: 'half',
    });
    const upstreamResponse = await fetch(upstreamRequest);
    if (upstreamResponse.status >= 300 && upstreamResponse.status < 400) {
      return jsonError(502, 'Unexpected upstream redirect');
    }

    const responseHeaders = new Headers({
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    for (const name of ['content-type', 'retry-after']) {
      const value = upstreamResponse.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return jsonError(502, 'Enquiry API is temporarily unavailable');
  }
}
