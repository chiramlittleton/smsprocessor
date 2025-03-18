const db = require("../models/database");
const pDebounce = require("p-debounce"); // ✅ Use require() directly

const saveMessage = pDebounce(async (from, to, message) => {
  const query = `
    INSERT INTO sms_messages ("from", "to", message, status)
    VALUES ($/from/, $/to/, $/message/, 'received')
    RETURNING *;
  `;
  return db.one(query, { from, to, message });
}, 2000, { leading: true });

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

module.exports = { saveMessage, fetchMessages };
