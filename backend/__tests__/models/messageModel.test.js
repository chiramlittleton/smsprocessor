const MessageModel = require("../../src/models/messageModel");
const db = require("../../src/models/database");
const { v4: uuidv4 } = require("uuid");

jest.mock("../../src/models/database", () => ({
  one: jest.fn(),
  any: jest.fn(),
}));

jest.mock("p-debounce", () => (fn) => fn);

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

    db.one.mockResolvedValue(mockMessage);

    const result = await MessageModel.saveMessage(
      mockMessage.from,
      mockMessage.to,
      mockMessage.message
    );

    expect(db.one).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO sms_messages"),
      expect.objectContaining({
        from: mockMessage.from,
        to: mockMessage.to,
        message: mockMessage.message,
      })
    );
    expect(result).toEqual(mockMessage);
  });

  it("should debounce duplicate messages within 2 seconds", async () => {
    const mockMessage = {
      from: "+12345678901",
      to: "+10987654321",
      message: "Debounce test",
    };

    db.one.mockResolvedValue({ id: uuidv4(), ...mockMessage, status: "received" });

    await MessageModel.saveMessage(mockMessage.from, mockMessage.to, mockMessage.message);
    await MessageModel.saveMessage(mockMessage.from, mockMessage.to, mockMessage.message);

    expect(db.one).toHaveBeenCalledTimes(2);

  });

  it("should throw an error if saving a message fails", async () => {
    db.one.mockRejectedValue(new Error("Database failure"));

    await expect(
      MessageModel.saveMessage("+12345678901", "+10987654321", "Hello!")
    ).rejects.toThrow("Database failure");
  });

  it("should fetch messages based on the provided filters", async () => {
    const mockMessages = [
      { id: uuidv4(), from: "+12345678901", to: "+10987654321", message: "Hello!", status: "received" },
      { id: uuidv4(), from: "+12345678902", to: "+10987654322", message: "Hi!", status: "sent" },
    ];

    db.any.mockResolvedValue(mockMessages);

    const result = await MessageModel.fetchMessages({ from: "+12345678901" });

    expect(db.any).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM sms_messages"),
      expect.objectContaining({ from: "+12345678901" })
    );
    expect(result).toEqual(mockMessages);
  });

  it("should fetch all messages when no filters are provided", async () => {
    const mockMessages = [{ id: uuidv4(), from: "+11111111111", to: "+22222222222", message: "Hello!" }];

    db.any.mockResolvedValue(mockMessages);

    const result = await MessageModel.fetchMessages({});

    expect(db.any).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM sms_messages"),
      expect.any(Object)
    );
    expect(result).toEqual(mockMessages);
  });

  it("should return an empty array if no messages are found", async () => {
    db.any.mockResolvedValue([]);

    const result = await MessageModel.fetchMessages({ from: "+99999999999" });

    expect(result).toEqual([]);
  });

  it("should throw an error when fetching messages fails", async () => {
    db.any.mockRejectedValue(new Error("Database failure"));

    await expect(MessageModel.fetchMessages({ from: "+12345678901" })).rejects.toThrow("Database failure");
  });
});