const { validateMessage } = require("../../src/middleware/validation");
const { validationResult } = require("express-validator");
const httpMocks = require("node-mocks-http");

describe("Validation Middleware", () => {
  // ✅ Helper function to execute middleware and collect errors
  const runMiddleware = async (req, res) => {
    for (const middleware of validateMessage) {
      await middleware(req, res, () => {});
    }
    return validationResult(req);
  };

  // ✅ Test: Message too long (161 characters)
  it("should return an error if the message exceeds 160 characters", async () => {
    const req = httpMocks.createRequest({
      body: {
        from: "+12345678901",
        to: "+19876543210",
        message: "A".repeat(161), // ❌ 161 characters
      },
    });
    const res = httpMocks.createResponse();

    const errors = await runMiddleware(req, res);

    // ✅ Ensure validation fails
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()[0].msg).toContain("Message must be between 1 and 160 characters");
  });
});
