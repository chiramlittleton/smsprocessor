const MessageModel = require("../models/messageModel");

const saveMessage = async (from, to, message) => {
  if (await MessageModel.isDuplicateMessage(from, to, message)) {
    throw new Error("Duplicate message detected.");
  }
  return await MessageModel.saveMessage(from, to, message);
};

const fetchMessages = async (filters) => {
  return await MessageModel.fetchMessages(filters);
};

module.exports = { saveMessage, fetchMessages };
