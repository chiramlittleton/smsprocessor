const express = require("express");
const { sendMessage, getMediaForMessage, getMessages } = require("../controllers/messageController");
const rateLimitMiddleware = require("../middleware/rateLimiter");
const { validateMessage } = require("../middleware/validation");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ✅ Ensure Multer runs BEFORE validation to parse `req.body`
router.post("/", upload.single("file"), rateLimitMiddleware, validateMessage, sendMessage);
router.get("/", getMessages);
router.get("/:id/media", getMediaForMessage);

module.exports = router;
