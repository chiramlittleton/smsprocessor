const { body, validationResult } = require("express-validator");

// Validation rules for incoming SMS messages
const validateMessage = [
  body("from")
    .matches(/^\+\d{10,15}$/)
    .withMessage(
      "❌ Invalid sender number format (must follow E.164 standard)",
    ),

  body("to")
    .matches(/^\+\d{10,15}$/)
    .withMessage(
      "❌ Invalid recipient number format (must follow E.164 standard)",
    ),

  body("message")
    .isLength({ min: 1, max: 160 })
    .withMessage("❌ Message must be between 1 and 160 characters"),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateMessage };
