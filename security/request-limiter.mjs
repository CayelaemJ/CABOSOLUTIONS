// In-process safety net. Enforce additional distributed/edge limits for multi-instance production.
export function createRequestLimiter({ now = Date.now, maxKeys = 50000 } = {}) {
  const buckets = new Map();
  return (req, res, scope, max, windowMs) => {
    const at = now();
    const peer = String(req.socket?.remoteAddress || 'unknown');
    // Only trust forwarded IPs when the deployment's reverse proxy is verified to overwrite them.
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = process.env.TRUST_PROXY_HOPS === '1' && forwarded ? forwarded : peer;
    const key = scope + ':' + ip;
    let entry = buckets.get(key);
    if (!entry || entry.resetAt <= at) {
      if (buckets.size >= maxKeys) {
        for (const [k, value] of buckets) if (value.resetAt <= at) buckets.delete(k);
        if (buckets.size >= maxKeys) {
          res.setHeader('Retry-After', '60');
          return false;
        }
      }
      entry = { count: 0, resetAt: at + windowMs };
      buckets.set(key, entry);
    }
    entry.count++;
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((entry.resetAt - at) / 1000))));
      return false;
    }
    return true;
  };
}
