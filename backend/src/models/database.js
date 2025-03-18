const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

// Function to wait until PostgreSQL is ready
const waitForPostgres = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ PostgreSQL is running and accessible.");
      return;
    } catch (err) {
      console.log(`⏳ Waiting for PostgreSQL... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("❌ PostgreSQL is not available. Exiting...");
  process.exit(1);
};

// Function to initialize the database
const initDb = async () => {
  try {
    await waitForPostgres(); // Ensure PostgreSQL is ready

    const schemaPath = path.join(__dirname, "../../init.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    const checkTableQuery = `SELECT to_regclass('public.sms_messages') AS exists;`;
    const res = await pool.query(checkTableQuery);

    if (!res.rows[0].exists) {
      console.log("🛠️ Tables not found. Initializing database...");
      await pool.query(schema);
      console.log("✅ Database initialized successfully.");
    } else {
      console.log("✔️ Database tables already exist. Skipping initialization.");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

// Run database initialization
initDb();

module.exports = pool;
