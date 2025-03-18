const express = require("express");

const messageRoutes = require("./messageRoutes");

const router = express.Router();

// Define routes in a single place
router.use("/messages", messageRoutes);

module.exports = router;
