const express = require('express');
const { handleIncomingMessage, getMessages } = require('../controllers/messageController');
const rateLimitMiddleware = require('../middleware/rateLimiter');
const { validateMessage } = require('../middleware/validation'); // Import validation

const router = express.Router();

// Apply validation middleware
router.post('/', rateLimitMiddleware, validateMessage, handleIncomingMessage);
router.get('/', getMessages);

module.exports = router;
