const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const MEDIA_STORAGE_DIR = path.join(__dirname, "../../uploads");

// Ensure the media directory exists
if (!fs.existsSync(MEDIA_STORAGE_DIR)) {
  fs.mkdirSync(MEDIA_STORAGE_DIR, { recursive: true });
}

// ✅ Save media file
const saveMedia = async (messageId, file) => {
  if (!file || !file.mimetype.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(MEDIA_STORAGE_DIR, fileName);

  // ✅ Deduplication: Check if file exists
  if (fs.existsSync(filePath)) {
    return { messageId, filePath };
  }

  // ✅ Save file
  fs.writeFileSync(filePath, file.buffer);
  return { messageId, filePath };
};

// ✅ Retrieve media by message ID
const getMediaByMessageId = async (messageId) => {
  const files = fs.readdirSync(MEDIA_STORAGE_DIR);
  const mediaFiles = files.filter((file) => file.startsWith(messageId));

  if (mediaFiles.length === 0) {
    throw new Error("No media found for this message.");
  }

  return mediaFiles.map((file) => path.join(MEDIA_STORAGE_DIR, file));
};

module.exports = { saveMedia, getMediaByMessageId };
