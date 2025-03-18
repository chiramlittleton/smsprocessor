const { saveMessage, fetchMessages } = require("../../src/services/messageService");
const MessageModel = require("../../src/models/messageModel");

// ✅ Mock MessageModel methods
jest.mock("../../src/models/messageModel", () => ({
  isDuplicateMessage: jest.fn(),
  saveMessage: jest.fn(),
  fetchMessages: jest.fn(),
}));

describe("Message Service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  // ✅ Test: Save a valid message
  it("should save a message when it is not a duplicate", async () => {
    // Mock: Message is not a duplicate
    MessageModel.isDuplicateMessage.mockResolvedValue(false);

    // Mock: Save message
    const mockMessage = {
      id: "uuid-1234",
      from: "+1234567890",
      to: "+0987654321",
      message: "Hello, world!",
      status: "received",
    };
    MessageModel.saveMessage.mockResolvedValue(mockMessage);

    // Call function
    const result = await saveMessage("+1234567890", "+0987654321", "Hello, world!");

    // Assertions
    expect(MessageModel.isDuplicateMessage).toHaveBeenCalledWith("+1234567890", "+0987654321", "Hello, world!");
    expect(MessageModel.saveMessage).toHaveBeenCalledWith("+1234567890", "+0987654321", "Hello, world!");
    expect(result).toEqual(mockMessage);
  });

  // ✅ Test: Prevent saving duplicate messages
  it("should throw an error if the message is a duplicate", async () => {
    MessageModel.isDuplicateMessage.mockResolvedValue(true);

    await expect(saveMessage("+1234567890", "+0987654321", "Duplicate test")).rejects.toThrow(
      "Duplicate message detected."
    );

    expect(MessageModel.isDuplicateMessage).toHaveBeenCalledWith("+1234567890", "+0987654321", "Duplicate test");
    expect(MessageModel.saveMessage).not.toHaveBeenCalled();
  });

  // ✅ Test: Fetch messages with filters
  it("should fetch messages with filters", async () => {
    const mockMessages = [
      { id: "uuid-1234", from: "+1234567890", to: "+0987654321", message: "Test message", status: "received" },
    ];
    MessageModel.fetchMessages.mockResolvedValue(mockMessages);

    const result = await fetchMessages({ from: "+1234567890" });

    expect(MessageModel.fetchMessages).toHaveBeenCalledWith({ from: "+1234567890" });
    expect(result).toEqual(mockMessages);
  });

  // ✅ Test: Prevent saving empty messages
  it("should throw an error if message content is empty", async () => {
    await expect(saveMessage("+1234567890", "+0987654321", "")).rejects.toThrow("Message cannot be empty.");
  });

  // ✅ Test: Handle database errors
  it("should throw an error if the database query fails", async () => {
    MessageModel.isDuplicateMessage.mockResolvedValue(false);
    MessageModel.saveMessage.mockRejectedValue(new Error("Database failure"));

    await expect(saveMessage("+1234567890", "+0987654321", "DB error test")).rejects.toThrow("Database failure");
  });
});
