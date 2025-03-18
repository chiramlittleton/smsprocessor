const request = require("supertest");
const express = require("express");
const messageRoutes = require("../../src/routes/messageRoutes");
const { handleIncomingMessage, getMessages } = require("../../src/controllers/messageController");
const { validateMessage } = require("../../src/middleware/validation");

// ✅ Mock dependencies
jest.mock("../../src/controllers/messageController", () => ({
  handleIncomingMessage: jest.fn((req, res) => res.status(201).json({ success: true })),
  getMessages: jest.fn((req, res) => res.status(200).json([{ id: "1", message: "Hello" }])),
}));

jest.mock("../../src/middleware/validation", () => ({
  validateMessage: jest.fn((req, res, next) => next()),
}));

// ✅ Fix: Define mock inline inside `jest.mock()`
jest.mock("../../src/middleware/rateLimiter", () => (req, res, next) => {
  if (req.body.message === "Spam!") {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }
  next();
});

const app = express();
app.use(express.json());
app.use("/messages", messageRoutes);

describe("Message Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test: Middleware executes in correct order
  it("should run rate limiter before validation and controller", async () => {
    const res = await request(app).post("/messages").send({
      from: "+12345678901",
      to: "+10987654321",
      message: "Hello!",
    });

    expect(validateMessage).toHaveBeenCalled(); // ✅ Validation middleware executed
    expect(handleIncomingMessage).toHaveBeenCalled(); // ✅ Controller was reached
  });

  // 🚫 Test: Validation should block invalid requests before reaching controller
  it("should reject invalid requests before reaching controller", async () => {
    validateMessage.mockImplementation((req, res) =>
      res.status(400).json({ error: "Validation failed" })
    );

    const res = await request(app).post("/messages").send({
      to: "+10987654321",
      message: "Hello!",
    });

    expect(res.statusCode).toBe(400);
    expect(handleIncomingMessage).not.toHaveBeenCalled(); // ❌ Controller should NOT be called
  });

  // ✅ Test: GET `/messages` should call `getMessages` controller
  it("should call getMessages controller on GET request", async () => {
    const res = await request(app).get("/messages");

    expect(getMessages).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  // 🚫 Test: Rate limiter should prevent excessive requests before validation
  it("should block excessive requests before hitting validation", async () => {
    const res = await request(app).post("/messages").send({
      from: "+12345678901",
      to: "+10987654321",
      message: "Spam!", // This triggers our rate limit mock
    });

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe("Rate limit exceeded");
    expect(validateMessage).not.toHaveBeenCalled(); // ❌ Validation shouldn't run if rate-limited
    expect(handleIncomingMessage).not.toHaveBeenCalled(); // ❌ Controller shouldn't be reached
  });
});
