const { RateLimiterMemory } = require("rate-limiter-flexible");

// ✅ Middleware Factory Function
const createRateLimitMiddleware = (rateLimiterInstance) => {
  return async (req, res, next) => {
    try {
      const sender = req.body.from;

      if (!sender) {
        return res.status(400).json({ error: "Sender phone number required" });
      }

      await rateLimiterInstance.consume(sender);
      next();
    } catch (error) {
      res.status(429).json({ error: "Rate limit exceeded. Please wait." });
    }
  };
};

// ✅ Default Rate Limiter Instance
const defaultRateLimiter = new RateLimiterMemory({
  points: 5, // Max 5 messages per minute
  duration: 60,
});

// ✅ Export both the default middleware and the factory function
module.exports = createRateLimitMiddleware(defaultRateLimiter);
module.exports.createRateLimitMiddleware = createRateLimitMiddleware;
