const MessageModel = require("../../src/models/messageModel");
const pool = require("../../src/models/database"); // ✅ Corrected import path
const { v4: uuidv4 } = require("uuid");

// ✅ Mock database queries
jest.mock("../../src/models/database", () => ({
  query: jest.fn(), // ✅ Ensures Jest correctly mocks the DB query method
}));

describe("MessageModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save a message and return the stored record", async () => {
    const mockMessage = {
      id: uuidv4(),
      from: "+12345678901",
      to: "+10987654321",
      message: "Hello!",
      status: "received",
    };

    pool.query.mockResolvedValueOnce({ rows: [mockMessage] });

    const result = await MessageModel.saveMessage(
      mockMessage.from,
      mockMessage.to,
      mockMessage.message
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO sms_messages"),
      expect.arrayContaining([expect.any(String), mockMessage.from, mockMessage.to, mockMessage.message])
    );
    expect(result).toEqual(mockMessage);
  });

  it("should throw an error if saving a message fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database failure"));

    await expect(
      MessageModel.saveMessage("+12345678901", "+10987654321", "Hello!")
    ).rejects.toThrow("Failed to save message.");
  });

  it("should fetch messages based on the provided filters", async () => {
    const mockMessages = [
      { id: uuidv4(), from: "+12345678901", to: "+10987654321", message: "Hello!", status: "received" },
      { id: uuidv4(), from: "+12345678902", to: "+10987654322", message: "Hi!", status: "sent" },
    ];

    pool.query.mockResolvedValueOnce({ rows: mockMessages });

    const result = await MessageModel.fetchMessages({ from: "+12345678901" });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM sms_messages"),
      expect.arrayContaining(["+12345678901"])
    );
    expect(result).toEqual(mockMessages);
  });

  it("should fetch all messages when no filters are provided", async () => {
    const mockMessages = [
      { id: uuidv4(), from: "+11111111111", to: "+22222222222", message: "Hello!" },
    ];

    pool.query.mockResolvedValueOnce({ rows: mockMessages });

    const result = await MessageModel.fetchMessages({});

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM sms_messages"), []);
    expect(result).toEqual(mockMessages);
  });

  it("should return an empty array if no messages are found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await MessageModel.fetchMessages({ from: "+99999999999" });

    expect(result).toEqual([]);
  });

  it("should throw an error when fetching messages fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database failure"));

    await expect(MessageModel.fetchMessages({ from: "+12345678901" })).rejects.toThrow("Failed to fetch messages.");
  });

  it("should check for duplicate messages within 2 seconds", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: uuidv4() }] });

    const isDuplicate = await MessageModel.isDuplicateMessage(
      "+12345678901",
      "+10987654321",
      "Hello, again!"
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id FROM sms_messages"),
      expect.arrayContaining(["+12345678901", "+10987654321", "Hello, again!"])
    );
    expect(isDuplicate).toBe(true);
  });

  it("should return false when no duplicate messages exist", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const isDuplicate = await MessageModel.isDuplicateMessage(
      "+12345678901",
      "+10987654321",
      "Unique message!"
    );

    expect(isDuplicate).toBe(false);
  });

  it("should throw an error when checking for duplicate messages fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database failure"));

    await expect(
      MessageModel.isDuplicateMessage("+12345678901", "+10987654321", "Hello!")
    ).rejects.toThrow("Duplicate message check failed.");
  });
});
