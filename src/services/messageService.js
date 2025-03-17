const MessageModel = require('../models/messageModel');

const saveMessage = async (from, to, message) => {
    // Check if the message is a duplicate
    const isDuplicate = await MessageModel.isDuplicateMessage(from, to, message);
    if (isDuplicate) {
        throw new Error("Duplicate message detected.");
    }

    // Save the message to the database using MessageModel
    return await MessageModel.saveMessage(from, to, message);
};

const fetchMessages = async (filters) => {
    return await MessageModel.fetchMessages(filters);
};

module.exports = { saveMessage, fetchMessages };
