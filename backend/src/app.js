const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes"); // Centralized routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Parses JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Parses form-data requests

// ✅ Register Routes
app.use("/api", routes);

module.exports = app;
