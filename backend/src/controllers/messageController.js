const fs = require("fs");
const path = require("path");
const db = require("../models/database");
const multer = require("multer");

// ✅ Configure multer for memory storage (handling media uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const sendMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const file = req.file; // Media file

    if (!from || !to || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Insert message with correct column names
    const result = await db.query(
      `INSERT INTO sms_messages ("from", "to", message, status) 
       VALUES ($1, $2, $3, 'received') RETURNING id`,
      [from, to, message]
    );

    if (!result.rows.length) {
      throw new Error("Failed to retrieve message ID");
    }

    const messageId = result.rows[0].id;
    let filePath = null;

    // ✅ Save media if provided
    if (file) {
      const uploadDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      filePath = path.join(uploadDir, `${messageId}-${file.originalname}`);
      fs.writeFileSync(filePath, file.buffer);

      await db.query(
        `INSERT INTO media_attachments (message_id, file_path, file_type, file_size) 
         VALUES ($1, $2, $3, $4)`,
        [messageId, filePath, file.mimetype, file.size]
      );
    }

    res.json({ messageId, message, filePath });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Get messages (with media if available)
const getMessages = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sms_messages.*, 
              media_attachments.file_path, 
              media_attachments.file_type 
       FROM sms_messages 
       LEFT JOIN media_attachments ON sms_messages.id = media_attachments.message_id 
       ORDER BY sms_messages.received_at DESC LIMIT 10`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

module.exports = { sendMessage, getMessages };
