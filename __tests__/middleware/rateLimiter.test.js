const { createRateLimitMiddleware } = require("../../src/middleware/rateLimiter");
const httpMocks = require("node-mocks-http");
const { RateLimiterMemory } = require("rate-limiter-flexible");

// ✅ Step 1: Mock RateLimiterMemory globally
jest.mock("rate-limiter-flexible", () => {
  return {
    RateLimiterMemory: jest.fn().mockImplementation(() => ({
      consume: jest.fn(),
    })),
  };
});

describe("Rate Limiter Middleware", () => {
  let req, res, next, rateLimiterMock, rateLimitMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();

    req = httpMocks.createRequest({
      body: { from: "+12345678901" },
    });
    res = httpMocks.createResponse();
    next = jest.fn();

    // ✅ Step 2: Create a fresh mocked RateLimiterMemory instance for each test
    rateLimiterMock = new RateLimiterMemory();
    
    // ✅ Step 3: Inject the mock into the middleware
    rateLimitMiddleware = createRateLimitMiddleware(rateLimiterMock);
  });

  // ✅ Test: Allow requests under the limit
  it("should allow request if under the rate limit", async () => {
    rateLimiterMock.consume.mockResolvedValue(true); // ✅ Simulate success

    await rateLimitMiddleware(req, res, next);

    expect(rateLimiterMock.consume).toHaveBeenCalledWith("+12345678901");
    expect(next).toHaveBeenCalled(); // ✅ Ensures request proceeds
  });

  // ✅ Test: Reject requests over the limit
  it("should reject request with HTTP 429 when rate limit is exceeded", async () => {
    rateLimiterMock.consume.mockRejectedValue(new Error("Rate limit exceeded"));

    await rateLimitMiddleware(req, res, next);

    expect(rateLimiterMock.consume).toHaveBeenCalledWith("+12345678901");
    expect(res.statusCode).toBe(429);
    expect(res._getJSONData().error).toBe("Rate limit exceeded. Please wait.");
    expect(next).not.toHaveBeenCalled(); // ✅ Middleware stops request
  });

  // ✅ Test: Missing `from` field should return 400
  it("should return 400 if sender phone number is missing", async () => {
    req.body = {}; // ❌ No 'from' field

    await rateLimitMiddleware(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().error).toBe("Sender phone number required");
    expect(rateLimiterMock.consume).not.toHaveBeenCalled(); // ✅ Ensures consume was NOT called
    expect(next).not.toHaveBeenCalled(); // ✅ Ensures request was blocked
  });
});
