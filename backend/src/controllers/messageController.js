const { saveMessage, fetchMessages } = require("../services/messageService");

const handleIncomingMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const result = await saveMessage(from, to, message);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await fetchMessages(req.query);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleIncomingMessage, getMessages };
