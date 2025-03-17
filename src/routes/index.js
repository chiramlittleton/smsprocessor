const express = require('express');

const messageRoutes = require('./messageRoutes');
const mediaRoutes = require('./mediaRoutes');

const router = express.Router();

// Define routes in a single place
router.use('/messages', messageRoutes);
router.use('/media', mediaRoutes);

module.exports = router;
