const MessageModel = require("../models/messageModel");

const saveMessage = async (from, to, message) => {
    // ✅ Validate message first!
    if (!message || message.trim().length === 0) {
      throw new Error("Message cannot be empty.");
    }
  
    const isDuplicate = await MessageModel.isDuplicateMessage(from, to, message);
    if (isDuplicate) {
      throw new Error("Duplicate message detected.");
    }
  
    return MessageModel.saveMessage(from, to, message);
  };
  
const fetchMessages = async (filters) => {
  return await MessageModel.fetchMessages(filters);
};

module.exports = { saveMessage, fetchMessages };
