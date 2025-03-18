const { body, validationResult } = require("express-validator");

const validateMessage = [
  (req, res, next) => {
    // ✅ Ensure request body is available even if using multipart/form-data
    if (!req.body.from) {
      return res.status(400).json({ error: "Sender phone number required" });
    }
    if (!req.body.to) {
      return res.status(400).json({ error: "Recipient phone number required" });
    }
    if (!req.body.message) {
      return res.status(400).json({ error: "Message content required" });
    }
    next();
  },

  body("from")
    .optional() // ✅ Make it optional since we manually check it above
    .matches(/^\+\d{10,15}$/)
    .withMessage("Invalid sender number format"),

  body("to")
    .optional()
    .matches(/^\+\d{10,15}$/)
    .withMessage("Invalid recipient number format"),

  body("message")
    .optional()
    .isLength({ min: 1, max: 160 })
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
