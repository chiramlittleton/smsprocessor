const pgp = require("pg-promise")({
  capSQL: true, // Capitalized SQL keywords for readability
});
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ✅ Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  max: 30, // Maximum connections in pool
};

const db = pgp(dbConfig);

// ✅ Function to wait until PostgreSQL is ready
const waitForPostgres = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await db.one("SELECT 1");
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

// ✅ Function to initialize the database
const initDb = async () => {
  try {
    await waitForPostgres(); // Ensure PostgreSQL is ready

    const schemaPath = path.join(__dirname, "../../init.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    const checkTableQuery = `SELECT to_regclass('public.sms_messages') AS exists;`;
    const res = await db.one(checkTableQuery);

    if (!res.exists) {
      console.log("🛠️ Tables not found. Initializing database...");
      await db.none(schema);
      console.log("✅ Database initialized successfully.");
    } else {
      console.log("✔️ Database tables already exist. Skipping initialization.");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

// ✅ Run database initialization
initDb();

module.exports = db;
