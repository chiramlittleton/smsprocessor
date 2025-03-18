const { body, validationResult } = require("express-validator");

const validateMessage = [
  body("from")
    .matches(/^\+\d{10,15}$/)
    .withMessage("Invalid sender number format"),

  body("to")
    .matches(/^\+\d{10,15}$/)
    .withMessage("Invalid recipient number format"),

  body("message")
    .isLength({ min: 1, max: 160 }) // ✅ Fix: Enforce max 160 characters
    .withMessage("Message must be between 1 and 160 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateMessage };
