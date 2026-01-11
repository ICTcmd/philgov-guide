type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

const trackers = new Map<string, Map<string, { count: number; startTime: number }>>();

export function rateLimit(ip: string, endpoint: string, config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }) {
  if (ip === 'unknown' || process.env.NODE_ENV === 'development') {
    // Optional: looser limits in dev
    // return true; 
  }

  if (!trackers.has(endpoint)) {
    trackers.set(endpoint, new Map());
  }

  const endpointTracker = trackers.get(endpoint)!;
  const now = Date.now();
  const record = endpointTracker.get(ip);

  if (!record) {
    endpointTracker.set(ip, { count: 1, startTime: now });
    return { success: true, limit: config.maxRequests, remaining: config.maxRequests - 1, reset: now + config.windowMs };
  }

  if (now - record.startTime > config.windowMs) {
    endpointTracker.set(ip, { count: 1, startTime: now });
    return { success: true, limit: config.maxRequests, remaining: config.maxRequests - 1, reset: now + config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return { success: false, limit: config.maxRequests, remaining: 0, reset: record.startTime + config.windowMs };
  }

  record.count++;
  return { success: true, limit: config.maxRequests, remaining: config.maxRequests - record.count, reset: record.startTime + config.windowMs };
}

export function getIp(req: Request) {
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
}
