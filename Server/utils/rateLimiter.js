const rateLimitWindowMs = 1000; // 1 second
const maxRequests = 50; // per window per IP
const ipRequestMap = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!ipRequestMap.has(ip)) {
    ipRequestMap.set(ip, []);
  }
  const timestamps = ipRequestMap.get(ip);
  while (timestamps.length && timestamps[0] <= now - rateLimitWindowMs) {
    timestamps.shift();
  }
  if (timestamps.length >= maxRequests) {
    return res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
  }
  timestamps.push(now);
  next();
}

module.exports = rateLimiter;
