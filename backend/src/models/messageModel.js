const db = require("../models/database");

// ✅ Save a new message
async function saveMessage(from, to, message) {
  const query = `
    INSERT INTO sms_messages ("from", "to", message, status)
    VALUES ($/from/, $/to/, $/message/, 'received')
    RETURNING *;
  `;
  return db.one(query, { from, to, message });
}

// ✅ Fetch messages with filters and pagination
async function fetchMessages({ from, to, status, limit = 10, offset = 0 }) {
  let conditions = [];
  let params = {};

  if (from) {
    conditions.push(`"from" = $/from/`);
    params.from = from;
  }
  if (to) {
    conditions.push(`"to" = $/to/`);
    params.to = to;
  }
  if (status) {
    conditions.push(`status = $/status/`);
    params.status = status;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `
    SELECT * FROM sms_messages
    ${whereClause}
    ORDER BY received_at DESC
    LIMIT $/limit/ OFFSET $/offset/;
  `;

  return db.any(query, { ...params, limit, offset });
}

// ✅ Check for duplicate message sent within 2 seconds
async function isDuplicateMessage(from, to, message) {
  const query = `
    SELECT COUNT(*) 
    FROM sms_messages
    WHERE "from" = $/from/
    AND "to" = $/to/
    AND message = $/message/
    AND received_at >= NOW() - INTERVAL '2 seconds';
  `;
  const result = await db.one(query, { from, to, message });
  return parseInt(result.count) > 0;
}

module.exports = { saveMessage, fetchMessages, isDuplicateMessage };
