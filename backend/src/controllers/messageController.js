const fs = require("fs");
const path = require("path");
const db = require("../models/database");
const multer = require("multer");

// ✅ Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const sendMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const file = req.file; // Media file

    if (!from || !to || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Use `pg-promise` transaction to insert message & media atomically
    const result = await db.tx(async (t) => {
      // Insert message
      const messageQuery = `
        INSERT INTO sms_messages ("from", "to", message, status) 
        VALUES ($/from/, $/to/, $/message/, 'received') 
        RETURNING id
      `;
      const messageId = await t.one(messageQuery, { from, to, message });

      let filePath = null;

      // ✅ Insert media attachment if a file is provided
      if (file) {
        const uploadDir = path.join(__dirname, "..", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        filePath = path.join(uploadDir, `${messageId.id}-${file.originalname}`);
        fs.writeFileSync(filePath, file.buffer);

        const mediaQuery = `
          INSERT INTO media_attachments (message_id, file_path, file_type, file_size) 
          VALUES ($/messageId/, $/filePath/, $/fileType/, $/fileSize/)
        `;
        await t.none(mediaQuery, {
          messageId: messageId.id,
          filePath,
          fileType: file.mimetype,
          fileSize: file.size,
        });
      }

      return { messageId: messageId.id, filePath };
    });

    res.json({ messageId: result.messageId, message, filePath: result.filePath });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { from, to, status, limit = 10, offset = 0 } = req.query;

    // ✅ Convert query params to integers for pagination
    const queryParams = {
      from,
      to,
      status,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    };

    let conditions = [];
    if (from) conditions.push(`sms_messages."from" = $/from/`);
    if (to) conditions.push(`sms_messages."to" = $/to/`);
    if (status) conditions.push(`sms_messages.status = $/status/`);

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // ✅ Use `pg-promise` with Named Parameters
    const messages = await db.any(
      `SELECT sms_messages.*, media_attachments.file_path, media_attachments.file_type
       FROM sms_messages
       LEFT JOIN media_attachments ON sms_messages.id = media_attachments.message_id
       ${whereClause}
       ORDER BY sms_messages.received_at DESC
       LIMIT $/limit/ OFFSET $/offset/`,
      queryParams
    );

    res.json({ messages, limit, offset });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

module.exports = { sendMessage, getMessages };
