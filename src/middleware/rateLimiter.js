const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 5, // Max 5 messages per minute
    duration: 60,
});

const rateLimitMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.body.from);
        next();
    } catch (error) {
        res.status(429).json({ error: 'Rate limit exceeded. Please wait.' });
    }
};

module.exports = rateLimitMiddleware;
