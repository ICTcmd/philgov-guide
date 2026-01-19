type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

const trackers = new Map<string, Map<string, { count: number; startTime: number }>>();

const DEFAULT_WINDOW_MS = (() => {
  const raw = process.env.RATE_LIMIT_WINDOW_MS;
  if (!raw) return 60000;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 60000;
  return parsed;
})();

const DEFAULT_MAX_REQUESTS = (() => {
  const raw = process.env.RATE_LIMIT_MAX_REQUESTS;
  if (!raw) return 10;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
  return parsed;
})();

export function rateLimit(ip: string, endpoint: string, config: RateLimitConfig = { windowMs: DEFAULT_WINDOW_MS, maxRequests: DEFAULT_MAX_REQUESTS }) {
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
